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
    DATE_ADDED: "Recent",
    RATING: "Rating",
    STATUS: "Status",
    PRICE: "Price"
}



class LibPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            entry: null,
            playing: false,
            time: 0,
            duration: 0,
            volume: 0.5,
            muted: false
        };
    }

    setEntry(entry) {
        this.setState({ entry: entry });
        this.play();
    }

    play() {
        this.setState({ playing: true, hidden: false });
    }

    pause() {
        this.setState({ playing: false });
    }

    playClick() {
        if (this.state.playing) {
            this.pause();
        } else {

            this.play();
        }
    }

    setProgress(progress) {
        console.log(progress);
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
        // set progress
        this.setProgress(progress);
    }



    render() {

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

        const currentTime = "00:00";
        const maxTime = "99:99";
        const progress = "20";

        console.log(this.state.entry);

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
                        <button className="libPlayerMainButton" onClick={() => { this.playClick(); }}>{buttonSrc}</button>
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

        window.resetApp = this.reset.bind(this);
    }

    play(entry) {
        this.player.current.setEntry(entry);
    }

    isStore() {
        // check if this menu is for the store
        // false if store is not in props
        return this.props.isStore !== undefined;
    }

    async loadLibrary() {
        const data = {
            session_id: this.props.app.state.user.session_id
        };
        const res = await this.props.app.apiRequest('/library', 'POST', data);
        const json = await res.json();
        this.setState({ library: json.items });
    }

    async loadStore() {
        const resS = await this.props.app.apiRequest('/store', 'GET');
        const jsonS = await resS.json();

        // check if logged in
        try {
            if (this.props.app.state.user !== null) {

                const resL = await this.props.app.apiRequest('/library', 'POST', { session_id: this.props.app.state.user.session_id });
                const jsonL = await resL.json();
                this.setState({ userLibrary: jsonL.items });
            }
        } catch (e) {
            console.log(e);
        }

        this.setState({ library: jsonS.items });
    }

    async componentDidMount() {

        // load store if this is the store menu
        if (this.isStore()) {
            await (this.loadStore());
            return;
        }

        // load library if logged in
        if (this.props.app.state.user !== null) {
            await (this.loadLibrary());
        }

        // use long polling to update library
        //TODO: add long polling
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
                                <option className='al-button'>{SortMode.DATE_ADDED}</option>
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
                {this.isStore() ? null : <LibPlayer ref={this.player} />}
            </div>
        );
    }
}

export default LibMenu;