import './reset.css';
import './style.css';
import './navbar.css';
import './library.css';
import './Login.css';
import LibMenu from './LibMenu';
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Store from './Store';
import NoApi from './NoApi';
import Register from './Register';
import Charge from './Charge';
//import {Login} from "./Login";
//import {Login} from "./Register";


function longPollController(task) {
  var polling = true;
  const longPoll = async () => {

    await task();
    if (polling) {
      setTimeout(async () => {
        try {
          let status = await longPoll();
          if (status >= 400) {
            polling = false;
          }
        } catch (error) {
          polling = false;
        }
      }, 100);
    }

  };

  const cancel = () => {
    polling = false;
  };

  setTimeout(async () => {
    await longPoll();
  }, 100);

  return cancel;
}

function pollingController(task) {

  var cancel = () => { };
  var interval = setInterval(async () => {
    try {
      await task();
    } catch (error) {
      cancel();
    }
  }, 1000);

  cancel = () => {
    clearInterval(interval);
  };

  return cancel;
}


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      apiAvailable: true,
      redirect: null,
    };

    this.myMenu = React.createRef();

  }

  async fetchTimeout(url, options, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, options)
        .then(response => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        })
    })
  }

  async componentWillUnmount() {
    if (this.lpCancel) {
      this.lpCancel();
    }
  }

  startPolling(user) {
    this.userState = -1;
      const longPoll = async () => {
        const response = await this.apiRequest("/user_state/", "POST",
          {
            session_id: user.session_id,
            state: this.userState
          });
        const data = await response.json();
        if (response.status === 200) {
          if (this.userState === -1) {
            this.userState = data.state;
            return response.status;
          }
          if (data.state !== this.userState) {
            this.userState = data.state;

            await this.updateUser();
          }
        }
        return response.status;
      }

      const lpBound = longPoll.bind(this);

      this.lpCancel = pollingController(lpBound);
  }



  async componentDidMount() {

    // try to login with session id from local storage
    const session_id = localStorage.getItem("session_id");
    if (session_id) {
      const response = await this.apiRequest("/user/", "POST", { session_id: session_id });
      const data = await response.json();
      if (response.status === 200) {
        this.setUser(data.user);
      } else {
        localStorage.removeItem("session_id");
      }
    }



    // check if API is available

    return;
    /*
    let tries = 0;
    const maxTries = 3;
    while (tries < maxTries) {
      try {
        let response = await this.fetchTimeout(this.getAPIAddress() + "/", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
          }
        }, 1000);
        if (response.status === 200) {
          break;
        }
      } catch (error) {
      }

      tries++;
      await this.sleep(100);
    }
    if (tries === maxTries) {
      // api is not available
      this.setState({ apiAvailable: false });
      return;
    }*/

  }

  getAPIAddress() {
    return "http://localhost:3456";
  }

  async apiRequest(endpoint, method, body) {
    let url = this.getAPIAddress() + endpoint;
    let options = {
      method: method,
      // CORS Access-Control-Allow-Origin
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'

      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    let response = await fetch(url, options);
    return response;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  redirect(path) {
    this.setState({ redirect: path });
  }


  async register(username, password, email) {
    const response = await this.apiRequest("/register/", "POST", { username: username, password: password, email: email });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {

      return await this.login(username, password);

    }
    else {
      return false;
    }
  }

  async updateUser() {
    const response = await this.apiRequest("/user/", "POST", { session_id: this.state.user.session_id });
   
    if(response.status === 200){
      const data = await response.json();
      this.setUser(data.user);
    }
  }

  setUser(user) {

    // stop polling for old user if it exists
    let newPolling = false;
    if(this.state.user !== null && (user===null || this.state.user.session_id !== user.session_id)){
      if (this.lpCancel) {
        this.lpCancel();
      }
      newPolling = true;
    } else if(this.state.user === null && user !== null){
      newPolling = true;
    }

    this.setState({ user: user });

    if(newPolling && user !== null){
      this.startPolling(user);
    }

  }


  async login(username, password) {
    const response = await this.apiRequest("/login/", "POST", { username: username, password: password });
    const data = await response.json();
    if (response.status === 200) {
      this.setUser(data.user);

      // set session in local storage
      localStorage.setItem("session_id", data.user.session_id);

      this.redirect("/");
      return true;
    }
    else {
      return false;
    }
  }

  async logout() {
    if (this.state.user === null) {
      return false;
    }
    const sid = this.state.user.session_id;
    const response = await this.apiRequest("/logout", "POST", { session_id: sid });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      this.setUser(null);
      this.redirect("/");
      return true;
    }
    else {
      return false;
    }
  }


  render() {

    let redirect = null;
    if (this.state.redirect) {
      redirect = this.state.redirect;
      this.setState({ redirect: null });
      // Router link to path

    }


    let home = <Home library={this} />;

    if (!this.state.apiAvailable) {
      return (
        <NoApi apiAddress={this.getAPIAddress()} />
      );
    }


    return (


      <Router>
        <Navbar user={this.state.user} app={this} />
        <div className="AudioUI">
          {redirect === null ? null : <Navigate to={redirect} />}
          <Routes>
            <Route path="/" element={home} />
            <Route path="/library" element={<LibMenu app={this} user={this.state.user} callback={this.props.callback} ref={this.myMenu} stateChanger={() => { this.filterUpdate(); }} />} />
            <Route path="/login" element={<Login app={this} />} />
            <Route path="/register" element={<Register app={this} />} />
            <Route path="/store" element={<Store app={this} user={this.state.user} />} />
            <Route path="/charge" element={<Charge app={this} user={this.state.user} />} />
          </Routes>
        </div>
      </Router>

    );
  }
}

export default App;
