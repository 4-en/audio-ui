import './App.css';
import React from 'react';

const ListenStatus = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

// enum for sorting mode 
const SortMode = {
  NAME: "Name",
  DATE_RELEASED: "Release date",
  DATE_ADDED: "Recent",
  RATING: "Rating",
  STATUS: "Status"
}

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

function getPriceString(price) {
  price = price/100;
  return price.toFixed(2) + "€";
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
  let d = new Date(date * 1000);
  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  return day + "." + month + "." + year;
}

class ContentRating extends React.Component {
  constructor(props) {
    super(props);
    this.rating = 0;
    if ("rating" in props) {
      this.rating = props.rating;
    }
    this.symbol = "★";
    if ("symbol" in props) {
      this.symbol = props.symbol;
    }

  }

  render() {
    let rating = this.rating;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating > 0) {
        stars.push(<span className="libEntryStar" key={i}>{this.symbol}</span>);
      } else {
        stars.push(<span className="libEntryNoStar" key={i}>{this.symbol}</span>);
      }
      rating--;
    }
    // eg 4.5 ★★★★
    return (
      <div className="contentRating">
        <span className="contentRatingNumber">{this.rating.toFixed(1)} </span>
        <span className="contentRatingStars">{stars}</span>
      </div>
    );
  }
}

class StorePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const duration = formatDuration(this.props.entry.duration);
    const rating = this.props.entry.rating;
    const price = getPriceString(this.props.entry.price);

    return (
      <div className="rightPanel">
        <div className="rightPanelTop">
          {/*
          - Rating
          - Duration
          - Buy button (with price) or grayed out if already owned with "Owned" text
          */}
          <div className="rightPanelRating">
            <ContentRating rating={rating} />
          </div>
          <div className="rightPanelDuration">{duration}</div>

        </div>
        <div className="rightPanelBottom">
          <div className="rightPanelBuy">
            <button className="rightPanelBuyButton">Buy for {price}</button>
          </div>
        </div>
      </div>
    );
  }
}

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.progress = 0;
    if ("progress" in props) {
      this.progress = props.progress;
    }
    this.progress = 30;
  }

  render() {
    return (
      <div className='progressOuter'>
        <div className='progressInner' style={{ width: this.progress + '%' }}></div>
      </div>
    );
  }
}

class LibraryPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rating = this.props.entry.rating;
    const progress = this.props.entry.progress;
    let status = ListenStatus.NOT_STARTED;
    if (progress > 0.05) {
      status = ListenStatus.IN_PROGRESS;
      if (progress > 0.95) {
        status = ListenStatus.COMPLETED;
      }
    }

    const durationLeft = formatDuration(this.props.entry.duration * (1 - progress));

    return (
      <div className="rightPanel">
        <div className="rightPanelTop">
          {/*
          - Status
          - Rating
          - Duration
          - Progress bar
          */}
          <div className="rightPanelRating">
            <ContentRating rating={rating} />
          </div>
          <div className="rightPanelStatus">{status}</div>
          <ProgressBar progress={progress * 100} />
          
          <div className="rightPanelDuration">Remaining: {durationLeft}</div>

        </div>
        <div className="rightPanelBottom">
          <div className="rightPanelPlay">
            <button className="rightPanelPlayButton">Play</button>
          </div>
        </div>
      </div>
    );
  }
}


// create react component
class LibEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    // check if isChild is set in props
    if ("isChild" in props) {
      this.isChild = props.isChild;
    } else {
      this.isChild = false;
    }


  }

  showSeries() {
    return (!this.isChild) && (this.props.entry.series !== "");
  }

  getStatus() {
    let entry = this.props.entry;

    let duration = this.getDuration();

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
    let duration = entry.duration;

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

  getAuthorName() {
    let entry = this.props.entry;
    let author = entry.author;
    let name = author["first_name"] + " " + author["last_name"];
    return name;
  }


  render() {
    let entry = this.props.entry;

    let duration = this.getDuration();

    let status = this.getStatus();
    let coverSize = this.isChild ? 110 : 138;


    let key = 0;
    let sortedCategories = entry.categories.sort();
    let addComma = () => { return key++ < sortedCategories.length - 1; };
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
      <div className="libEntry libBottomBorder" onClick={(e) => {
        // add class extended to libEntry
        e.target.classList.toggle("extended");
      }}>
        <img className="libEntryCover" src={"static/covers/" + entry.cover_file} alt="cover" height={coverSize} width={coverSize} />
        <div className="libEntryMain">
          <div className="libEntryTitle">{entry.title}</div>
          {this.isChild ? "" :
            <div className="libEntryAuthor libEntryDetails">
              <span>by </span>
              <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(this.getAuthorName()); }}>{this.getAuthorName()}</span>
            </div>
          }
          {this.showSeries() ?
            <div className="libEntrySeries libEntryDetails">
              <span>Series: </span>
              <span className="libEntryLink" onClick={() => { this.props.libMenu.setSearch(entry.series); }}>{entry.series}</span>
            </div>
            : ""}
          <div className="libEntryDate libEntryDetails">{formatDate(entry.releaseDate)}</div>
          <div className="libEntryCategories libEntryDetails">{categories}</div>
          <div className="libEntryDescription libEntryDetails">{entry.description}</div>
        </div>
        <div className="libEntryRight">
          {this.props.isStore ? <StorePanel entry={entry} /> : <LibraryPanel entry={entry} />}
          {/*
          <div className="libEntryStatus libEntryDetails">{status}</div>
          <div className="libEntryRating libEntryDetails">{this.getRating()}</div>
          <div className="libEntryDuration libEntryDetails">{formatDuration(duration)}</div>
          <div className="libEntryButtons libEntryDetails">
            
            <button className="libEntryButton libEntryPlay" onClick={
              (e) => { 
                let payload = {
                  type: "CLICK",
                  name: "playButton",
                  title: entry.title,
                  series: entry.series,
                  categories: entry.category,
                  entryType: entry.type,
                  author: entry.author
                }
                this.props.callback(payload); 

                // stop event from propagating to parent
                e.stopPropagation();
              }
            }>
              Play
            </button>
          </div>
          */}
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
    return entries[0].cover_file;
  }

  getAuthor() {
    // return author of first entry
    let entries = this.getEntries();
    return entries[0].author;
  }

  getAuthorName() {
    // return author of first entry
    let entries = this.getEntries();
    let author = entries[0].author;
    let name = author["first_name"] + " " + author["last_name"];
    return name;
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
      if (allNotStarted && (entry.progress > 0.05)) {
        allNotStarted = false;
      }
      if (allFinished && (entry.progress < 0.95)) {
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
      duration += entry.duration;
    }
    return duration;
  }

  getCategories() {
    // return all categories
    let entries = this.getEntries();
    let categories = {};
    for (let entry of entries) {
      for (let category of entry.categories) {
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
    for (let category of categories) {
      catCompontents.push(<span className="libEntryCategory libEntryDetails" key={key}>
        <span className="libEntryLink" onClick={(e) => {
          e.stopPropagation();
          this.props.libMenu.catClick(category);
        }}>
          {category}
        </span>
        {key < categories.length - 1 ? ", " : ""}
      </span>);
      key++;
    }

    return catCompontents;
  }

  render() {

    let entries = this.getEntries();
    let entryComponents = [];
    let key = 0;
    for (let entry of entries) {
      entryComponents.push(<LibEntry isStore={this.props.isStore} entry={entry} key={key} callback={this.props.callback} libMenu={this.props.libMenu} isChild={true} />);
      key++;
    }

    if (entries.length === 0) {
      return (<div></div>);
    }

    if (entries.length === 1) {
      return (<LibEntry isStore={this.props.isStore} entry={entries[0]} key={key} callback={this.props.callback} libMenu={this.props.libMenu} />);
    }

    return (
      <div className="libBottomBorder  libSeriesEntry" onClick={() => {
        this.setState({ extended: !this.state.extended });
      }}>
        <div className="libEntry" >
          <img className="libEntryCover" src={"static/covers/" + this.getCover()} alt="cover" height={138} width={138} />
          <div className="libEntryMain">
            <div className="libEntryTitle">{"Series: " + this.getName()}</div>
            <div className="libEntryAuthor libEntryDetails">
              <span>by </span>
              <span className="libEntryLink" onClick={(e) => {
                e.stopPropagation();
                this.props.libMenu.setSearch(this.getAuthorName());
              }}>{this.getAuthorName()}</span>
            </div>

            <div className="libEntryDate libEntryDetails">{formatDate(this.getReleaseDate())}</div>
            <div className="libEntryCategories libEntryDetails">{this.getCategories()}</div>
            {this.state.extended ? "" : <div className="libEntryDetails libEntryExpandText"><h3>Click to view titles</h3></div>}
          </div>
          <div className="libEntryRight">

            {/*<div className="libEntryStatus libEntryDetails">{this.getStatus()}</div>*/}
            <div className="libEntryRating libEntryDetails">{this.getRating()}</div>
            <div className="libEntryDuration libEntryDetails">{formatDuration(this.getDuration())}</div>
            <div className="libEntryButtons libEntryDetails">
              {entries.length + (entries.length > 1 ? " titles" : " title")}
            </div>
          </div>

        </div>
        <div className={"libSeriesEntries" + (this.state.extended ? "" : " disabled")}>
          {entryComponents}
        </div>
      </div>
    );
  }
}

function ascMode(x) {
  // check if x is boolean
  if (typeof x === "boolean") {
    if (x) {
      // return arrow up ascii
      return "\u2191";
    } else {
      // return arrow down ascii
      return "\u2193";
    }
  } else {
    // return boolean of x
    if (x === "\u2191") {
      return true;
    } else if (x === "\u2193") {
      return false;
    }
  }

  return undefined;
}


class LibList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortMode: SortMode.NAME,
      sortAsc: false
    };

    //this.state.sortMode = document.querySelector(".libMenuSorter").value;
  }

  reset() {
    this.setState({
      sortMode: SortMode.NAME,
      sortAsc: false
    });
  }

  setSortMode(event) {
    let mode = event.target.value ?? this.state.sortMode;


    this.setState({ sortMode: mode });
  }

  setSortAsc(event) {
    let asc = event.target.innerHTML ?? ascMode(this.state.sortAsc);
    // swap asc
    let ascB = ascMode(asc);
    asc = !ascB;
    this.setState({ sortAsc: asc });

    // change text
    if (event.target.innerHTML) {
      event.target.innerHTML = ascMode(asc);
    }
  }

  getEntryList() {
    let lib = this.props.library;

    // sort library
    let sortMode = this.state.sortMode;
    let sortAsc = this.state.sortAsc;

    let c = 1;
    if (!sortAsc) {
      c = -1;
    }

    const entrySortModes = {
      [SortMode.NAME]: (a, b) => { return b.title.localeCompare(a.title) * c; },
      [SortMode.DATE_ADDED]: (a, b) => { return (a.addedDate - b.addedDate) * c; },
      [SortMode.STATUS]: (a, b) => { return (a.progress - b.progress) * c; },
      [SortMode.RATING]: (a, b) => { return (a.rating - b.rating) * c; },
      [SortMode.DATE_RELEASED]: (a, b) => { return (a.releaseDate - b.releaseDate) * c; },
    };

    lib.sort(entrySortModes[sortMode]);


    let entries = [];
    let i = 0;
    for (let entry of lib) {
      entries.push(<LibEntry isStore={this.props.isStore} entry={entry} key={i} callback={this.props.callback} libMenu={this.props.libMenu} />);
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

    // only sort keys
    let keys = Object.keys(series);

    // sort library
    let sortMode = this.state.sortMode;
    let sortAsc = this.state.sortAsc;

    let c = 1;
    if (!sortAsc) {
      c = -1;
    }

    const seriesSortModes = {
      [SortMode.NAME]: (a, b) => { return b.localeCompare(a) * c; },
      [SortMode.DATE_ADDED]: (a, b) => { return (series[a][0].addedDate - series[b][0].addedDate) * c; },
      [SortMode.STATUS]: (a, b) => { return (series[a][0].progress - series[b][0].progress) * c; },
      [SortMode.RATING]: (a, b) => { return (series[a][0].rating - series[b][0].rating) * c; },
      [SortMode.DATE_RELEASED]: (a, b) => { return (series[a][0].releaseDate - series[b][0].releaseDate) * c; },
    };

    keys.sort(seriesSortModes[sortMode]);

    // create series entries
    let entries = [];
    let i = 0;
    for (let s of keys) {
      let e = series[s];
      entries.push(<LibSeriesEntry isStore={this.props.isStore} series={s} entries={e} callback={this.props.callback} key={i} libMenu={this.props.libMenu} />);
      i++;
    }


    return entries;
  }

  getAuthorList() {
    let lib = this.props.library;
    let authors = [];
    let entries = [];

    entries.push(<div key={1}>WIP :)</div>);

    return entries;
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