import './App.css';
import React from 'react';

const ListenStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

function formatDuration(duration) {
  let hours = Math.floor(duration / 3600);
  let minutes = Math.floor((duration - hours * 3600) / 60);
  let seconds = duration - hours * 3600 - minutes * 60;

  let formatted = "";
  if (hours > 0) {
    formatted += hours + "h ";
  }
  if (minutes > 0) {
    formatted += minutes + "m ";
  }
  if (hours === 0) {
    formatted += seconds + "s";
  }
  return formatted;
}

function formatRating(rating) {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating > 0) {
      stars.push(<span className="libEntryStar" key={i}>★</span>);
    } else {
      stars.push(<span className="libEntryNoStar" key={i}>☆</span>);
    }
    rating--;
  }
  return stars;
}

function formatDate(date) {
  // formats date from ctime to dd.mm.yyyy
  let d = new Date(date);
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  return day + "." + month + "." + year;
}

// create react component
class LibEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  isSubitem() {
    // if subitem is set in props, return true
    if (this.props.subitem) {
      return true;
    }
    return false;
  }

  getStatus() {
    let entry = this.props.entry;

    let duration = 0;
    for (let chapter of entry.chapters) {
      duration += chapter.duration;
    }

    let status = ListenStatus.NOT_STARTED;
    if (entry.progress > duration * 0.05) {
      status = ListenStatus.IN_PROGRESS;
      if (entry.progress > duration * 0.95) {
        status = ListenStatus.COMPLETED;
      }
    }
    return status;
  }

  getDuration() {
    let entry = this.props.entry;
    let duration = 0;
    for (let chapter of entry.chapters) {
      duration += chapter.duration;
    }

    return duration;
  }

  formatDuration(duration) {
    return formatDuration(duration);
  }

  getRating() {
    let entry = this.props.entry;
    let rating = entry.rating;
    return formatRating(rating);
  }


  render() {
    let entry = this.props.entry;

    let duration = this.getDuration();

    let status = this.getStatus();


    let key = 0;
    let sortedCategories = entry.category.sort();
    let addComma = () => { return key++ < sortedCategories.length-1; };
    let categories = sortedCategories.map((category) => {
      return <span className="libEntryCategory libEntryDetails" key={key++}>
        <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(category); }}>
          {category}
        </span>
        {addComma() ? ", " : ""}
      </span>;
    });

    categories = <span>Categories: {categories}</span>;

    return (
      <div className="libEntry" onClick={(e) => {
        // add class extended to libEntry
        e.target.classList.toggle("extended");
      }}>
        <img className="libEntryCover" src={"covers/" + entry.cover} alt="cover" height={150} width={150} />
        <div className="libEntryMain">
          <div className="libEntryTitle">{entry.title}</div>
          <div className="libEntryAuthor libEntryDetails">
            <span>by </span>
            <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(entry.author); }}>{entry.author}</span>
          </div>
          <div className="libEntrySeries libEntryDetails">
            <span>Series: </span>
            <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(entry.series); }}>{entry.series}</span>
          </div>
          <div className="libEntryDate libEntryDetails">{formatDate(entry.releaseDate)}</div>
          <div className="libEntryCategories libEntryDetails">{categories}</div>
          <div className="libEntryDescription libEntryDetails">{entry.description}</div>
        </div>
        <div className="libEntryRight">

          <div className="libEntryStatus libEntryDetails">{status}</div>
          <div className="libEntryRating libEntryDetails">{this.getRating()}</div>
          <div className="libEntryDuration libEntryDetails">{formatDuration(duration)}</div>
          <div className="libEntryButtons libEntryDetails">
            <button className="libEntryButton libEntryFavourite">
              <img className="libFavButtonImage" src="/favourite.svg" alt="favourite" height={20} width={20} />
            </button>
            <button className="libEntryButton libEntryPlay">
              Play
            </button>
          </div>
        </div>
      </div>
    );
  }
}
// Displays Titles grouped as series
// Displays every Series with at least one title owned
// and gives options to buy remaining (not in demo)
class LibSeriesEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      extended: false
    };
  }

  getName() {
    return this.props.series;
  }

  getEntries() {
    return this.props.entries;
  }

  getReleaseDate() {
    // return release date of oldest title in series
    let entries = this.getEntries();
    let releaseDate = entries[0].releaseDate;
    for (let entry of entries) {
      if (entry.releaseDate < releaseDate) {
        releaseDate = entry.releaseDate;
      }
    }
    return releaseDate;
  }

  getCover() {
    // return cover of first entry
    let entries = this.getEntries();
    return entries[0].cover;
  }

  getAuthor() {
    // return author of first entry
    let entries = this.getEntries();
    return entries[0].author;
  }

  getStatus() {
    // NOT_STARTED, IN_PROGRESS, FINISHED
    // not started if all not started
    // finished if all finished
    // otherwise in progress
    let status = ListenStatus.IN_PROGRESS;
    let entries = this.getEntries();
    let allFinished = true;
    let allNotStarted = true;
    for (let entry of entries) {
      if (allNotStarted && (entry.status !== ListenStatus.NOT_STARTED)) {
        allNotStarted = false;
      }
      if (allFinished && (entry.status !== ListenStatus.COMPLETED)) {
        allFinished = false;
      }
    }
    if (allNotStarted) {
      status = ListenStatus.NOT_STARTED;
    } else if (allFinished) {
      status = ListenStatus.COMPLETED;
    }

    return status;
  }

  getAvgRating() {
    // return average rating
    let entries = this.getEntries();
    let rating = 0;
    for (let entry of entries) {
      rating += entry.rating;
    }
    rating /= entries.length;

    return rating;
  }

  getRating() {
    let rating = this.getAvgRating();
    return formatRating(rating);
  }

  getDuration() {
    // return total duration
    let entries = this.getEntries();
    let duration = 0;
    for (let entry of entries) {
      for (let chapter of entry.chapters) {
        duration += chapter.duration;
      }
    }
    return duration;
  }

  getCategories() {
    // return all categories
    let entries = this.getEntries();
    let categories = {};
    for (let entry of entries) {
      for (let category of entry.category) {
        if (!(category in categories)) {
          categories[category] = 1;
        } else {
          categories[category]++;
        }
      }
    }

    let key = 0;
    let catCompontents = [];
    categories = Object.keys(categories);
    for(let category of categories) {
      catCompontents.push( <span className="libEntryCategory libEntryDetails" key={key}>
        <span className="libEntryLink" onClick={() => { this.props.libMenu.catClick(category); }}>
          {category}
        </span>
        {key < categories.length-1 ? ", " : ""}
      </span>);
      key++;
    }

    return catCompontents;
  }

  render() {

    return (
      <div className="libEntry libSeriesEntry" onClick={() => {
        this.setState({ extended: !this.state.extended });
      }}>
        <img className="libEntryCover" src={"covers/" + this.getCover()} alt="cover" height={150} width={150} />
        <div className="libEntryMain">
          <div className="libEntryTitle">{this.getName()}</div>
          <div className="libEntryAuthor libEntryDetails">
            <span>by </span>
            <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(this.getAuthor()); }}>{this.getAuthor()}</span>
          </div>

          <div className="libEntryDate libEntryDetails">{formatDate(this.getReleaseDate())}</div>
          <div className="libEntryCategories libEntryDetails">{this.getCategories()}</div>
        </div>
        <div className="libEntryRight">

          <div className="libEntryStatus libEntryDetails">{this.getStatus()}</div>
          <div className="libEntryRating libEntryDetails">{this.getRating()}</div>
          <div className="libEntryDuration libEntryDetails">{formatDuration(this.getDuration())}</div>
          <div className="libEntryButtons libEntryDetails">
            <button className="libEntryButton libEntryFavourite">
              <img className="libFavButtonImage" src="/favourite.svg" alt="favourite" height={20} width={20} />
            </button>
            <button className="libEntryButton libEntryPlay">
              Play
            </button>
          </div>
        </div>
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

  getEntryList() {
    let lib = this.props.library;
    let entries = [];
    let i = 0;
    for (let entry of lib) {
      entries.push(<LibEntry entry={entry} key={i} libMenu={this.props.libMenu} />);
      i++;
    }

    return entries;
  }

  getSeriesList() {
    let lib = this.props.library;
    let series = {};

    // group entries by series
    // find all series in filter
    for (let entry of lib) {
      let seriesName = entry.series;
      if (seriesName === "") {
        seriesName = entry.title;
      }
      // check if seriesname is key in series
      if (!(seriesName in series)) {
        series[seriesName] = [];
      }

    }
    // add every title to series, even if filtered out
    let fullLib = this.props.libMenu.getLibrary();
    for (let entry of fullLib) {
      let seriesName = entry.series;
      if (seriesName === "") {
        seriesName = entry.title;
      }
      if (seriesName in series) {
        series[seriesName].push(entry);
      }
    }

    // sort keys by name
    let keys = Object.keys(series);
    keys.sort();

    // create series entries
    let entries = [];
    let i = 0;
    for (let s of keys) {
      let e = series[s];
      entries.push(<LibSeriesEntry series={s} entries={e} key={i} libMenu={this.props.libMenu} />);
      i++;
    }


    return entries;
  }

  getAuthorList() {
    let lib = this.props.library;
    let authors = [];

    return [];
  }

  render() {
    let entries = [];

    // render as entries, series or authors

    let listMode = 0;
    switch (this.props.libMenu.state.type) {
      case "Audiobooks":
        listMode = 1;
        break;
      case "Authors":
        listMode = 2;
        break;
      default:
        break;
    }
    switch (listMode) {
      case 0:
        // entries
        entries = this.getEntryList();
        break;
      case 1:
        // series
        entries = this.getSeriesList();
        break;
      case 2:
        // authors
        entries = this.getAuthorList();
        break;
      default:
        // entries
        entries = this.getEntryList();
        break;
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