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
//import {Login} from "./Login";
//import {Login} from "./Register";





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

  async componentDidMount() {
    // check if API is available

    return;

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
    }

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
    const response = await this.apiRequest("/register", "POST", { username: username, password: password, email: email });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      
      return await this.login(username, password);
      
    }
    else {
      return false;
    }
  }

  async login(username, password) {
    const response = await this.apiRequest("/login", "POST", { username: username, password: password });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      this.setState({ user: data.user });
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
      this.setState({ user: null });
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
            <Route path="/library" user={this.state.user} element={<LibMenu app={this} callback={this.props.callback} ref={this.myMenu} stateChanger={() => { this.filterUpdate(); }} />} />
            <Route path="/login" element={<Login app={this} />} />
            <Route path="/register" element={<Register app={this} />} />
            <Route path="/store" user={this.state.user} element={<Store app={this} />} />
          </Routes>
        </div>
      </Router>

    );
  }
}

export default App;
