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
    STATUS: "Status"
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
            library: []
        };

        this.myList = React.createRef();

        window.resetApp = this.reset.bind(this);
    }

    async testLogin() {
        const username = 'Bob';
        const password = '1234';

        const res = await this.props.app.login(username, password);

        if (res) {
            // wait
            this.loadLibrary();
        }

    }

    async loadLibrary() {
        const data = {
            session_id: this.props.app.state.user.session_id
        };
        const res = await this.props.app.apiRequest('/library', 'POST', data);
        const json = await res.json();
        this.setState({ library: json.items });
    }

    async componentDidMount() {
        // load library if logged in
        if (this.props.app.state.user !== null) {
            await(this.loadLibrary());
        }

        // use long polling to update library
        //TODO: add long polling
    }


    getLibrary() {
        console.log(this.state.library);
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
            let className = 'al-button filter-button ';
            if (this.state.type === MenuType[type]) {
                className += 'button-selected';
            }
            filterButtons.push(<button className={className} key={i} onClick={() => {
                this.filterClick(MenuType[type]);
                this.props.callback({ type: "CLICK", name: "typeButton", value: type });
            }}> {MenuType[type]} </button>);
            i++;
        }

        // create category buttons

        // get filtered library
        let library = this.getFilteredLibrary();

        if (this.props.app.state.user === null) {
            return (
                <div>
                    <button className="al-button" onClick={async () => {
                        await this.testLogin();
                    }}> Login </button>
                    </div>
            );
        }


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
                this.props.callback({ type: 'CLICK', name: "categoryButton", value: cat });
            }}> {catName} </button>);
        }



        return (
            <div>
                <div className="libMenu">
                    <div className="libMenuTitleBar">
                        <h1 className="libMenuTitle">Library</h1>
                        <input className="libMenuSearch" type="text" placeholder="Search" value={this.state.search} onChange={(event) => {
                            this.searchChange(event);
                            this.props.callback({ type: "KEY", name: "searchFieldInput", value: event.target.value });
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
                                this.props.callback({ type: "CLICK", name: "sortButton", value: e.target.value });
                            }}>
                                <option className='al-button'>{SortMode.NAME}</option>
                                <option className='al-button'>{SortMode.DATE_RELEASED}</option>
                                <option className='al-button'>{SortMode.DATE_ADDED}</option>
                                <option className='al-button'>{SortMode.RATING}</option>
                                <option className='al-button'>{SortMode.STATUS}</option>
                            </select>
                        </div>
                    </div>
                    <div className="libMenuCategoryBar">
                        {categoryButtons}
                    </div>


                </div>
                <LibList callback={this.props.callback} library={library} libMenu={this} ref={this.myList} />
            </div>
        );
    }
}

export default LibMenu;