import './App.css';
import React from 'react';

// create react component
class LibEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let entry = this.props.entry;

    return (
      <div className="libEntry">
        <div className="libEntryCover"></div>
        <div className="libEntryMain">
          <div className="libEntryInfo">"
            <div className="libEntryTitle">{entry.title}</div>
            <div className="libEntryAuthor">{entry.author}</div>
            <div className="libEntrySeries">{entry.series}</div>
            <div className="libEntryDate">1.1.1990</div>
          </div>
          <div className="libEntryRight">
            <div className="libEntryRating">Rating</div>
            <div className="libEntryDuration">23h 12m</div>
            <div className="libEntryStatus">Completed</div>
          </div>
        </div>
      </div>
    );
  }
}

class LibSeriesEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let series = this.props.series;

    return (
      <div className="libSeriesEntry">
        {this.props.entry.title}
      </div>
    );
  }
}

class LibList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    let lib = this.props.library;
    let entries = [];
    let i = 0;
    for (let entry of lib) {
      entries.push(<LibEntry entry={entry} key={i} />);
      i++;
    }

    return (
      <div className="libList">
        {entries}
      </div>
    );
  }
}

// export component
export default LibList;