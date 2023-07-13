import React from 'react';

import LibList from './LibList';

// enum for menu types
const MenuType = {
    ALL: 'All',
    AUDIOBOOKS: 'Audiobooks',
    PODCASTS: 'Podcasts',
    AUTHORS: 'Authors'
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


function longPollController(task) {
    var polling = true;
    const longPoll = async () => {

        await task();
        if (polling) {
            setTimeout(async () => {
                try {
                    await longPoll();
                } catch (error) { }
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
    
    var interval = setInterval(async () => {
        await task();
    }, 3000);

    const cancel = () => {
        clearInterval(interval);
    };

    return cancel;
}



class LibPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            entry: null,
            playing: false,
            time: 0,
            duration: 60 * 60,
            volume: 0.5,
            muted: false
        };

        this.audio = null;
    }

    async componentDidMount() {


    }

    async loadAudio(entry) {
        // get id
        const id = entry.content_id;
        // get audio url
        var res = await this.props.app.apiRequest('/play/', 'POST',
            {
                session_id: this.props.app.state.user.session_id,
                item_id: id
            }
        );
        var json = await res.json();
        console.log(json);

        const audioUrl = json.audio_url;

        // load audio file
        this.audio = document.getElementById('player_audio');

        this.audio.src = audioUrl;
        this.audio.load();


        // set event listeners
        var lastUpdate = 0;
        this.audio.addEventListener('timeupdate', async () => {
            this.setState({ time: this.audio.currentTime });

            // update time every 20 seconds

            if (Math.abs(this.audio.currentTime - lastUpdate) > UPDATE_TIME) {
                await updateTime(this.audio.currentTime);
                lastUpdate = this.audio.currentTime;
            }
        }
        );

        // update time in api every 20 seconds
        const UPDATE_TIME = 20;
        const updateTime = async (time) => {
            const trueDuration = entry.duration;
            const thisDuration = this.audio.duration;

            var trueTime = time / thisDuration * trueDuration;
            trueTime = Math.floor(trueTime);
            console.log(trueTime);
            const res = await this.props.app.apiRequest('/set_progress/', 'POST',
                {
                    session_id: this.props.app.state.user.session_id,
                    item_id: id,
                    progress: trueTime
                }
            );
            const json = await res.json();
        };


        this.audio.addEventListener('durationchange', async () => {
            this.setState({ duration: this.audio.duration });

        }
        );

        this.audio.addEventListener('ended', async () => {
            this.setState({ playing: false });

            // update time
            await updateTime(this.audio.currentTime);

        }
        );

        this.audio.addEventListener('error', () => {
            console.log('error');
        }
        );

        // metadata loaded
        this.audio.addEventListener('loadedmetadata', () => {
            var startTime = entry.progress / entry.duration;
            if (startTime > 0.95) {
                startTime = 0.0;
            } else {
                startTime = startTime * this.audio.duration;
            }
            console.log(startTime);
            this.audio.currentTime = startTime;
        });

    }




    async setEntry(entry) {
        this.audio = null;
        await this.loadAudio(entry);
        this.setState({ entry: entry });
        await this.play();
    }

    async play() {
        if (this.audio === null) {
            await this.loadAudio(this.state.entry);

        }
        this.setState({ playing: true, hidden: false });
        this.audio.play();
    }

    async pause() {
        this.setState({ playing: false });
        this.audio.pause();
    }

    async playClick() {
        if (this.state.playing) {
            await this.pause();
        } else {

            await this.play();
        }
    }

    progressClick(e) {
        // get progress bar
        let progressBar = document.getElementsByClassName('libPlayerProgressOuter')[0];
        // get progress bar width
        let progressBarWidth = progressBar.offsetWidth;
        // get click position
        let clickX = e.clientX;
        // get click position relative to progress bar
        let clickXRelative = clickX - progressBar.getBoundingClientRect().left;
        // get progress percentage
        let progress = clickXRelative / progressBarWidth;

        let newTime = progress * this.state.duration;
        this.audio.currentTime = newTime;

    }



    render() {

        const formatTime = (time) => {
            let hours = Math.floor(time / 3600);
            let hoursStr = hours < 10 ? '0' + hours : hours;
            let minutes = Math.floor(time / 60);
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let seconds = Math.floor(time % 60);
            seconds = seconds < 10 ? '0' + seconds : seconds;

            if (hours > 0) {
                return hoursStr + ':' + minutes + ':' + seconds;
            }

            return minutes + ':' + seconds;
        };


        if (this.state.hidden || this.state.entry === null) {
            return null;
        }

        const buttonSrc = this.state.playing ? (
            <svg className="libPlayerMainButtonImg" viewBox="0 0 128 128">
                <rect fill="currentColor" width="42.67" height="128" />
                <rect fill="currentColor" x="85.33" width="42.67" height="128" />
            </svg>) : (
            <svg className="libPlayerMainButtonImg" viewBox="0 0 99 128">
                <polygon fill="currentColor" points="0 0 99 64 0 128 0 0" />
            </svg>
        )

        const currentTime = formatTime(this.state.time);
        const maxTime = formatTime(this.state.duration);
        const progress = this.state.time / this.state.duration * 100;


        return (
            <div className="libPlayerContainer">
                <div className="libPlayer">
                    {/*<audio id="audio" src={this.state.entry !== null ? this.state.entry.audio_url : null} autoPlay={this.state.playing} />*/}

                    <div className="libPlayerInfo">
                        <img className="libPlayerCover" src={"/static/covers/" + this.state.entry.cover_file} alt="cover" />
                        <div className="libPlayerTextInfo">
                            <div className="libPlayerTitle">{this.state.entry.title}</div>
                            <div className="libPlayerAuthor">{this.state.entry.author.first_name + ' ' + this.state.entry.author.last_name}</div>
                        </div>
                    </div>
                    <div className="libPlayerControls">
                        <button className="libPlayerMainButton" onClick={async () => { await this.playClick(); }}>{buttonSrc}</button>
                        <div className="libPlayerTimeline">
                            <div className="libPlayerCurrent-time">{currentTime}</div>
                            <div className="libPlayerProgressOuter" onClick={(e) => { this.progressClick(e); }}>
                                <div className="libPlayerProgressInner" style={{ width: progress + '%' }}></div>
                            </div>
                            <div className="libPlayerMax-time">{maxTime}</div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

class LibMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: MenuType.AUDIOBOOKS,
            categories: [],
            subcategories: [],
            maxCategories: 5,
            maxSubcategories: 5,
            search: '',
            library: [],
            userLibrary: []
        };

        this.myList = React.createRef();
        this.player = React.createRef();
        this.apiState = -1;
        window.resetApp = this.reset.bind(this);
    }

    async play(entry) {
        await this.player.current.setEntry(entry);
    }

    isStore() {
        // check if this menu is for the store
        // false if store is not in props
        return this.props.isStore !== undefined;
    }

    async loadLibrary() {
        if (this.props.app.state.user === null) {
            return;
        }
        const data = {
            session_id: this.props.app.state.user.session_id
        };
        const res = await this.props.app.apiRequest('/library/', 'POST', data);
        const json = await res.json();
        this.apiState = json.state;
        this.setState({ library: json.items });
    }

    async loadStore() {
        const resS = await this.props.app.apiRequest('/store/', 'GET');
        const jsonS = await resS.json();

        // check if logged in
        try {
            if (this.props.app.state.user !== null) {

                const resL = await this.props.app.apiRequest('/library/', 'POST', { session_id: this.props.app.state.user.session_id });
                const jsonL = await resL.json();
                this.setState({ userLibrary: jsonL.items });
            }
        } catch (e) {
            console.log(e);
        }

        this.setState({ library: jsonS.items });
        this.apiState = jsonS.state;
    }

    async componentWillUnmount() {
        // cancel long polling
        if (this.longPollCancel !== undefined) {
            this.longPollCancel();
        }
    }


    async componentDidMount() {

        // load store if this is the store menu
        if (this.isStore()) {
            await (this.loadStore());
        } else {
            // load library if logged in
            if (this.props.app.state.user !== null) {
                await (this.loadLibrary());
            }
        }

        // use long polling to update library
        // create long polling task
        //console.log('long polling');
        const isStoreB = this.isStore();

        const longPoll = async () => {


            if (isStoreB) {
                var res = await this.props.app.apiRequest('/store_state/', 'POST', { state: this.apiState });
                //console.log("long poll result arrived");
                var json = await res.json();
                if (json.state !== this.apiState) {
                    await this.loadStore();
                }
            } else {
                var res = await this.props.app.apiRequest('/user_state/', 'POST', { session_id: this.props.app.state.user.session_id, state: this.apiState });
                var json = await res.json();
                if (json.state !== this.apiState) {
                    await this.loadLibrary();
                }
            }


        };

        // start long polling task
        this.longPollCancel = pollingController(longPoll);
        //console.log("After long poll");


    }


    getLibrary() {
        //console.log(this.state.library);
        return this.state.library;
    }

    filterClick(type) {
        this.setState({ type: type });
    }

    catClick(cat) {
        var cats = [];
        // add categories from state
        for (let c of this.state.categories) {
            cats.push(c);
        }
        // add new category
        if (!cats.includes(cat)) {
            cats.push(cat);
        } else {
            // remove category
            cats = cats.filter(c => c !== cat);
        }

        this.setState({ categories: cats });

    }

    setSearch(search) {
        this.setState({ search: search });
        this.resetView();
    }

    resetView() {
        // scroll to top with animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'

        });

    }

    subcatClick(subcat) {
        var subcats = [];
        // add subcategories from state
        for (let c of this.state.subcategories) {
            subcats.push(c);
        }
        // add new subcategory
        if (!subcats.includes(subcat)) {
            subcats.push(subcat);
        } else {
            // remove subcategory
            subcats = subcats.filter(c => c !== subcat);
        }
        this.setState({ subcategories: subcats });
    }

    searchChange(event) {
        this.setState({ search: event.target.value });
    }

    filterBySingleString(entry, search) {

        if (search === '') {
            return true;
        }

        let inverted = false;

        // check for special search options
        if (search.startsWith('-') || search.startsWith('!')) {
            inverted = true;
            search = search.substring(1);
        }


        // check if search is in title
        if (entry['title'].toLowerCase().includes(search)) {
            return true ^ inverted;
        }

        // check if search is in author
        let authorName = entry.author.first_name + ' ' + entry.author.last_name;
        if (authorName.toLowerCase().includes(search)) {
            return true ^ inverted;
        }

        // check if search is in category
        for (let cat of entry['categories']) {
            if (cat.toLowerCase().includes(search)) {
                return true ^ inverted;
            }
        }


        // check if search is in series
        if (entry['series'].toLowerCase().includes(search)) {
            return true ^ inverted;
        }

        return false ^ inverted;

    }

    reset() {
        this.setState({
            type: MenuType.AUDIOBOOKS,
            categories: [],
            subcategories: [],
            search: ''
        });

        this.myList.current.reset();
    }



    filterBySearch(entry) {
        let search = this.state.search.toLowerCase();
        if (search === '') {
            return true;
        }

        let seaches = search.split('+');
        for (let s of seaches) {
            // every search must be in entry, otherwise return false
            if (!this.filterBySingleString(entry, s)) {
                return false;
            }
        }

        return true;

    }

    getFilteredLibrary() {

        var lib = this.getLibrary();
        var filtered = [];

        // filter every entry
        mainLoop: for (let i = 0; i < lib.length; i++) {
            let entry = lib[i];
            // filter by type
            if (this.state.type !== MenuType.ALL) {

                switch (this.state.type) {
                    case MenuType.AUDIOBOOKS:
                        if (entry.audio_type !== 0) {
                            continue mainLoop;
                        }
                        break;
                    case MenuType.PODCASTS:
                        if (entry.audio_type !== 1) {
                            continue mainLoop;
                        }
                        break;
                    case MenuType.AUTHORS:
                        // TODO: show list of authors
                        break;
                    case MenuType.FAVOURITES:
                        // TODO: show list of favourites
                        break;
                    default:
                        break;
                }
            }

            // filter by categories
            if (this.state.categories.length > 0)
                for (let cat of this.state.categories) {
                    if (!entry.categories.includes(cat)) {
                        continue mainLoop;
                    }
                }


            // filter by subcategories

            if (this.state.subcategories.length > 0)
                for (let subcat of this.state.subcategories) {
                    if (!entry.subcategory.includes(subcat)) {
                        continue mainLoop;
                    }
                }

            // filter by search
            if (!this.filterBySearch(entry)) {
                continue mainLoop;
            }

            // add entry to filtered list
            filtered.push(entry);
        }

        // sort filtered list by title
        filtered.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });

        return filtered;
    }

    render() {

        // create filter buttons
        let filterButtons = [];
        let i = 0;
        for (let type in MenuType) {
            if (type === "AUTHORS") continue;
            let className = 'al-button filter-button ';
            if (this.state.type === MenuType[type]) {
                className += 'button-selected';
            }
            filterButtons.push(<button className={className} key={i} onClick={() => {
                this.filterClick(MenuType[type]);
                //this.props.callback({ type: "CLICK", name: "typeButton", value: type });
            }}> {MenuType[type]} </button>);
            i++;
        }

        // create category buttons

        // get filtered library
        let library = this.getFilteredLibrary();


        // ordered list of categories by number of entries
        // create map of categories and subcategories
        let categories = {};
        let subcategories = {};

        // count categories and subcategories
        for (let i = 0; i < library.length; i++) {
            let entry = library[i];
            let cats = entry['categories'];

            for (let cat of cats) {
                if (categories[cat] === undefined) {
                    categories[cat] = 0;
                }
                categories[cat]++;
            }

        }


        // sort categories by number of entries
        let sortedCategories = Object.keys(categories).sort(function (a, b) { return categories[b] - categories[a]; });



        let catSelected = (cat, lst) => {
            return lst.includes(cat) ? 'button-selected' : '';
        }


        // create category buttons
        let categoryButtons = [];
        for (let i = 0; i < sortedCategories.length && i < this.state.maxCategories; i++) {
            let cat = sortedCategories[i];
            let className = 'al-button category-button ' + catSelected(cat, this.state.categories);
            // capitalize first letter
            let catName = cat.charAt(0).toUpperCase() + cat.slice(1) + " (" + categories[cat] + ")";
            categoryButtons.push(<button className={className} key={i} onClick={() => {
                this.catClick(cat);
                //this.props.callback({ type: 'CLICK', name: "categoryButton", value: cat });
            }}> {catName} </button>);
        }



        return (
            <div>
                <div className="libMenu">
                    <div className="libMenuTitleBar">
                        <h1 className="libMenuTitle">{this.isStore() ? "Store" : "Library"}</h1>
                        <input className="libMenuSearch" type="text" placeholder="Search" value={this.state.search} onChange={(event) => {
                            this.searchChange(event);
                            //this.props.callback({ type: "KEY", name: "searchFieldInput", value: event.target.value });
                        }} />

                    </div>
                    <div className="libMenuFilterSortContainer">
                        <div className="libMenuFilterBar">
                            {filterButtons}
                        </div>
                        <div className="libMenuSortContainer">
                            <div className="libMenuSortDirection al-button" onClick={(e) => { this.myList.current.setSortAsc(e); }}>↓</div>
                            <select className="libMenuSorter al-button" onChange={(e) => {
                                this.myList.current.setSortMode(e);
                                //this.props.callback({ type: "CLICK", name: "sortButton", value: e.target.value });
                            }}>
                                <option className='al-button'>{SortMode.NAME}</option>
                                <option className='al-button'>{SortMode.DATE_RELEASED}</option>
                                {this.isStore() ? null : <option className='al-button'>{SortMode.LAST_LISTEN}</option>}
                                <option className='al-button'>{SortMode.RATING}</option>
                                {this.isStore() ? <option className='al-button'>{SortMode.PRICE}</option> : <option className='al-button'>{SortMode.STATUS}</option>}
                            </select>
                        </div>
                    </div>
                    <div className="libMenuCategoryBar">
                        {categoryButtons}
                    </div>


                </div>

                <LibList isStore={this.isStore()} library={library} libMenu={this} ref={this.myList} />
                <audio id="player_audio" autoPlay={false} />
                {this.isStore() ? null : <LibPlayer ref={this.player} app={this.props.app} />}
            </div>
        );
    }
}

export default LibMenu;