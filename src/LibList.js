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
  LAST_LISTEN: "Recent",
  RATING: "Rating",
  STATUS: "Status",
  PRICE: "Price"
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
  price = price / 100;
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
      this.state={rating: props.rating};
    }
    this.symbol = "★";
    if ("symbol" in props) {
      this.symbol = props.symbol;
    }

  }

  async rate(rating) {
    if(this.props.allowRating === null)
      return;
    // set rating
    this.setState({rating: rating});

    var res = await this.props.app.apiRequest("/rate/", "POST", {
      item_id: this.props.entry.content_id,
      rating: rating,
      session_id: this.props.app.state.user.session_id
    });

  }

  render() {
    let rating = Math.round(this.state.rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (rating > 0) {
        stars.push(<span className="libEntryStar" onClick={async ()=>{await this.rate(i+1);}} key={i}>{this.symbol}</span>);
      } else {
        stars.push(<span className="libEntryNoStar" onClick={async ()=>{await this.rate(i+1);}} key={i}>{this.symbol}</span>);
      }
      rating--;
    }
    const fixedVal = this.props.allowRating ? 0 : 1;
    // eg 4.5 ★★★★
    return (
      <div className="contentRating">
        {!this.props.allowRating ? <span className="contentRatingNumber">{this.state.rating.toFixed(fixedVal)} </span> : null}
        <span className="contentRatingStars">{stars}</span>
      </div>
    );
  }
}

class StorePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owned: false,
      loggedIn: false
    };


    

    this.state.owned = this.checkOwned();

  }

  checkOwned() {
    var user = null;
    var userLibrary = null;
    var loggedIn = false;
    if ("libMenu" in this.props) {
      userLibrary = this.props.libMenu.state.userLibrary;
      user = this.props.libMenu.props.app.state.user;
      if (user !== null) {
        loggedIn = true;
      }
    }
    // check if user owns this entry
    if (user === null) {
      return false;
    }
    if (userLibrary === null) {
      return false;
    }

    if (this.props.entry === null) {
      return false;
    }

    let id = this.props.entry.content_id;
    for (let entry of userLibrary) {
      if (entry.content_id === id) {
        return true;
      }
    }
    return false;
  }

  clickBuy(e) {
    e.stopPropagation();
    if (this.state.owned) {
      return;
    }
    // open buy dialog
    const dialog = document.querySelector(".buyDialog" + this.props.entry.content_id);
    dialog.showModal();
  }

  async clickBuyConfirm(e) {
    e.stopPropagation();
    // buy entry
    const app = this.props.libMenu.props.app;
    let req = await app.apiRequest("/buy", "POST", {
      item_id: this.props.entry.content_id,
      session_id: app.state.user.session_id
    });
    let res = await req.json();
    console.log(res);
    if (res.status !== true) {
      return;
    }
    const dialog = document.querySelector(".buyDialog" + this.props.entry.content_id);
    dialog.close();
    this.props.libMenu.props.store.setState({ balance: this.props.libMenu.props.store.state.balance - this.props.entry.price });
    this.setState({ owned: true });
  }

  closeBuyDialog(e) {
    e.stopPropagation();
    // close buy dialog
    const dialog = document.querySelector(".buyDialog" + this.props.entry.content_id);
    dialog.close();
  }

  async clickEdit(e) {
    e.stopPropagation();
    if(this.props.entry === null) {
      return;
    }

    this.props.libMenu.props.store.editItem(this.props.entry);
  }



  render() {
    const duration = formatDuration(this.props.entry.duration);
    const rating = this.props.entry.rating;
    const price = getPriceString(this.props.entry.price);

    
    var user = null;
    var userLibrary = null;
    var loggedIn = false;
    if ("libMenu" in this.props) {
      userLibrary = this.props.libMenu.state.userLibrary;
      user = this.props.libMenu.props.app.state.user;
      if (user !== null) {
        loggedIn = true;
      }
    }
    

    let buttonClass = "rightPanelBuyButton";
    if (this.state.owned) {
      buttonClass += " owned";
    }
    const buttonText = this.state.owned ? "Owned" : "Buy for " + price;
    return (
      <div className="rightPanel">
        <dialog className={"buyDialog" + " buyDialog" + this.props.entry.content_id} onClick={(e) => { e.stopPropagation(); }} open={this.state.buyDialogOpen}>
          <div className="buyDialogInner">
            {(loggedIn) ?
              (<div>
                <div className="buyDialogHeader">Buy {this.props.entry.title} for {price}?</div>
                <div className="buyDialogButtons">
                  <button className="buyDialogCancel rightPanelBuyButton" onClick={(e) => { this.closeBuyDialog(e); }}>Cancel</button>
                  <button className="buyDialogBuy rightPanelBuyButton" onClick={(e) => { this.clickBuyConfirm(e); }}>Buy</button>
                </div>
              </div>) :
              (<div>
                <div className="buyDialogHeader">You must be logged in to buy {this.props.entry.title}.</div>
                <button className="buyDialogCancel rightPanelBuyButton" onClick={(e) => { this.closeBuyDialog(e); }}>Cancel</button>
              </div>)
            }
          </div>
        </dialog>

        <div className="rightPanelTop">
          {/*
          - Rating
          - Duration
          - Buy button (with price) or grayed out if already owned with "Owned" text
          */}
          <div className="rightPanelRating">
            <ContentRating entry={this.props.entry} app={this.props.app} rating={rating} />
          </div>
          <div className="rightPanelDuration">{duration}</div>

        </div>
        <div className="rightPanelBottom">
          <div className="rightPanelBuy">
            {user !== null && user.admin ?
            <button onClick={(e) => this.clickEdit(e)} className={buttonClass+" editButtonMarginR"}>Edit</button>
            : null}
            <button onClick={(e) => this.clickBuy(e)} className={buttonClass}>{buttonText}</button>
  
          </div>
        </div>
      </div>
    );
  }
}

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    
    
  }

  render() {
    return (
      <div className='progressOuter'>
        <div className='progressInner' style={{ width: this.props.progress + '%' }}></div>
      </div>
    );
  }
}

class LibraryPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  async play(e) {
    e.stopPropagation();
    await this.props.libMenu.play(this.props.entry);
  }

  render() {
    const rating = this.props.entry.user_rating;
    const progress = this.props.entry.progress;
    const progPercent = progress / this.props.entry.duration;
    let status = ListenStatus.NOT_STARTED;
    if (progPercent > 0.05) {
      status = ListenStatus.IN_PROGRESS;
      if (progPercent > 0.95) {
        status = ListenStatus.COMPLETED;
      }
    }


    const durationLeft = formatDuration(this.props.entry.duration  - progress);

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
            <ContentRating entry={this.props.entry} app={this.props.app} rating={rating} allowRating={true} />
          </div>
          <div className="rightPanelStatus">{status}</div>
          <ProgressBar progress={progPercent * 100} />

          <div className="rightPanelDuration">Remaining: {durationLeft}</div>

        </div>
        <div className="rightPanelBottom">
          <div className="rightPanelPlay">
            <button className="rightPanelPlayButton" onClick={async (e) => { await this.play(e); }}><svg className="libPlayerMainButtonImg" viewBox="0 0 99 128">
              <polygon fill="currentColor" points="0 0 99 64 0 128 0 0" />
            </svg></button>
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
          {this.props.isStore ? <StorePanel app={this.props.libMenu.props.app} entry={this.props.entry} libMenu={this.props.libMenu} /> : <LibraryPanel app={this.props.libMenu.props.app} entry={this.props.entry} libMenu={this.props.libMenu} />}
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
    let rating = Math.round(this.getAvgRating());
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
      entryComponents.push(<LibEntry isStore={this.props.isStore} entry={entry} key={key} libMenu={this.props.libMenu} isChild={true} />);
      key++;
    }

    if (entries.length === 0) {
      return (<div></div>);
    }

    if (entries.length === 1) {
      return (<LibEntry isStore={this.props.isStore} entry={entries[0]} key={key} libMenu={this.props.libMenu} />);
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
      [SortMode.LAST_LISTEN]: (a, b) => { return (a.last_played - b.last_played) * c; },
      [SortMode.STATUS]: (a, b) => { return (a.progress / a.duration - b.progress / b.duration) * c; },
      [SortMode.RATING]: (a, b) => { return (a.rating - b.rating) * c; },
      [SortMode.DATE_RELEASED]: (a, b) => { return (a.releaseDate - b.releaseDate) * c; },
      [SortMode.PRICE]: (a, b) => { return (a.price - b.price) * c; },
    };

    lib.sort(entrySortModes[sortMode]);


    let entries = [];
    let i = 0;
    for (let entry of lib) {
      entries.push(<LibEntry isStore={this.props.isStore} entry={entry} key={i} libMenu={this.props.libMenu} />);
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
      [SortMode.LAST_LISTEN]: (a, b) => { return (series[a][0].last_played - series[b][0].last_played) * c; },
      [SortMode.STATUS]: (a, b) => { return (series[a][0].progress - series[b][0].progress) * c; },
      [SortMode.RATING]: (a, b) => { return (series[a][0].rating - series[b][0].rating) * c; },
      [SortMode.DATE_RELEASED]: (a, b) => { return (series[a][0].releaseDate - series[b][0].releaseDate) * c; },
      [SortMode.PRICE]: (a, b) => { return (series[a].map((e) => { return e.price; }).reduce((a, b) => { return a + b; }) - series[b].map((e) => { return e.price; }).reduce((a, b) => { return a + b; })) * c; },
    };

    keys.sort(seriesSortModes[sortMode]);

    // create series entries
    let entries = [];
    let i = 0;
    for (let s of keys) {
      let e = series[s];
      entries.push(<LibSeriesEntry isStore={this.props.isStore} series={s} entries={e} key={i} libMenu={this.props.libMenu} />);
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