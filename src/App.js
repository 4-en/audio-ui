import './reset.css';
import './style.css';
import './navbar.css';
import './library.css';
import LibMenu from './LibMenu';
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Store from './Store';
import AdminStore from './AdminStore';


/*
  Library entry structure:

  entry = {
                "title": faker.sentence(nb_words=3),
                "author": author,
                "category": [category],
                "subcategory": [subcategory],
                "series": series,
                "type": type,
                "description": faker.paragraph(nb_sentences=3),
                "chapters": clist,
                "rating": random.random() * 4 + 1,
                "price": round( random.random() * 20 + 5.99, 2),
                "cover": ""
            }


*/




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      library: this.props.library
    };

    this.myMenu = React.createRef();

  }

  getLibrary() {
    return this.state.library;
  }


  render() {

    let home = <Home library={this} />;


    return (

      <Router>
        <Navbar library={this} />
        <div className="AudioUI">
          <Routes>
            <Route path="/" element={home} />
            <Route path="/library" element={<LibMenu library={this} callback={this.props.callback} ref={this.myMenu} stateChanger={() => { this.filterUpdate(); }} />} />
            <Route path="/login" element={<Login library={this} />} />
            <Route path="/store" element={<Store library={this} />} />
            <Route path="/admin" element={<AdminStore library={this} />} />
          </Routes>
        </div>
      </Router>

    );
  }
}

export default App;
