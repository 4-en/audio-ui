import './reset.css';
import './style.css';
import './navbar.css';
import './library.css';
import './Login.css';
import LibMenu from './LibMenu';
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Store from './Store';
import AdminStore from './AdminStore';
import NoApi from './NoApi';
import Register from './Register';
//import {Login} from "./Login";
//import {Login} from "./Register";


/*
  Library entry structure:

  entry = {
                "title": faker.sentence(nb_words=3),
                "author": {
                    "first_name": faker.first_name(),
                    "last_name": faker.last_name(),
                    "bio": faker.paragraph(nb_sentences=3),
                }
                "category": [category],
                "series": series,
                "type": type,
                "description": faker.paragraph(nb_sentences=3),
                "duration": random.randint(1, 1000),
                "rating": random.random() * 4 + 1,
                "price": round( random.random() * 20 + 5.99, 2),
                "cover": ""
            }


*/




class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      apiAvailable: true,
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

  async login(username, password) {
    const response = await this.apiRequest("/login", "POST", { username: username, password: password });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      this.setState({ user: data.user });
      return true;
    }
    else {
      return false;
    }
  }


  render() {

    let home = <Home library={this} />;

    if (!this.state.apiAvailable) {
      return (
        <NoApi apiAddress={this.getAPIAddress()} />
      );
    }


    return (

      <Router>
        <Navbar app={this} />
        <div className="AudioUI">
          <Routes>
            <Route path="/" element={home} />
            <Route path="/library" element={<LibMenu app={this} callback={this.props.callback} ref={this.myMenu} stateChanger={() => { this.filterUpdate(); }} />} />
            <Route path="/login" element={<Login app={this} />} />
            <Route path="/register" element={<Register app={this} />} />
            <Route path="/store" element={<Store app={this} />} />
            <Route path="/admin" element={<AdminStore app={this} />} />
          </Routes>
        </div>
      </Router>

    );
  }
}

export default App;
