import './reset.css';
import './style.css';
import LibMenu from './LibMenu';
import React from 'react';

const { userModeToggle } = require('./dark-light-toggle.js');

// load library from json file
//const library = require('./library.json');



/*
  library structure:

  Title
  Menu

  Entry 1
  Entry 2
  Entry 3
  Entry 4
  ...


*/

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
    this.myList = React.createRef();

  }

  getLibrary() {
    return this.state.library;
  }


  render() {
    return (
      <div className="Library" onClick={() => { /*userModeToggle();*/ }}>
        <LibMenu library={this} ref={this.myMenu} stateChanger={()=>{ this.filterUpdate(); }}/>
  
      </div>
    );
  }
}

export default App;