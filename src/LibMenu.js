import React from 'react';

import LibList from './LibList';

// enum for menu types
const MenuType = {
    ALL: 'All',
    AUDIOBOOKS: 'Audiobooks',
    PODCASTS: 'Podcasts',
    AUTHORS: 'Authors',
    FAVOURITES: 'Favourites'
};

class LibMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: MenuType.ALL,
            categories: [],
            subcategories: [],
            maxCategories: 5,
            maxSubcategories: 5,
            search: ''
        };
    }

    getLibrary() {
        return this.props.library.getLibrary();
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

    filterBySearch(entry) {
        let search = this.state.search.toLowerCase();
        if (search === '') {
            return true;
        }

        // check if search is in title
        if (entry['title'].toLowerCase().includes(search)) {
            return true;
        }

        // check if search is in author
        if (entry['author'].toLowerCase().includes(search)) {
            return true;
        }

        // check if search is in category
        for (let cat of entry['category']) {
            if (cat.toLowerCase().includes(search)) {
                return true;
            }
        }

        // check if search is in subcategory
        for (let subcat of entry['subcategory']) {
            if (subcat.toLowerCase().includes(search)) {
                return true;
            }
        }

        // check if search is in series
        if (entry['series'].toLowerCase().includes(search)) {
            return true;
        }

        return false;

    }

    getFilteredLibrary() {

        var lib = this.getLibrary();
        var filtered = [];

        // filter every entry
        mainLoop:for (let i = 0; i < lib.length; i++) {
            let entry = lib[i];
            // filter by type
            if (this.state.type !== MenuType.ALL) {
                if (entry.type !== this.state.type) {
                    continue mainLoop;
                }
            }

            // filter by categories
            if(this.state.categories.length > 0)
                for (let cat of this.state.categories) {
                    if (!entry.category.includes(cat)) {
                        continue mainLoop;
                    }
                }
            

            // filter by subcategories

            if(this.state.subcategories.length > 0)
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

        console.log(filtered.length);
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
            filterButtons.push(<button className={className} key={i} onClick={() => { this.filterClick(MenuType[type]); }}> {MenuType[type]} </button>);
            i++;
        }

        // create category buttons

        // get filtered library
        let library = this.getFilteredLibrary();


        // ordered list of categories by number of entries
        // create map of categories and subcategories
        let categories = {};
        let subcategories = {};
        /*
        for (let i = 0; i < library.length; i++) {
            let entry = library[i];
            let cats = entry['category'];

            // continue if state.categories is not empty and entry does not contain all of the categories
            if (this.state.categories.length != 0 && !this.state.categories.every(cat => cats.includes(cat))) {
                continue;
            }

            let subcats = entry['subcategory'];
            // continue if state.subcategories is not empty and entry does not contain all of the subcategories
            if (this.state.subcategories.length != 0 && !this.state.subcategories.every(subcat => subcats.includes(subcat))) {
                continue;
            }

            // continue if search is not empty and entry does not contain search
            if (!this.filterBySearch(entry)) {
                continue;
            }

            let checkSubs = false;

            for (let cat of cats) {
                if (categories[cat] === undefined) {
                    categories[cat] = 0;
                }
                if (this.state.categories.includes(cat)) {
                    checkSubs = true;
                }
                categories[cat]++;
            }

            if (!checkSubs) {
                continue;
            }


            for (let subcat of subcats) {
                if (subcategories[subcat] === undefined) {
                    subcategories[subcat] = 0;
                }
                subcategories[subcat]++;
            }

        }*/

        // count categories and subcategories
        for (let i = 0; i < library.length; i++) {
            let entry = library[i];
            let cats = entry['category'];
            let subcats = entry['subcategory'];

            for (let cat of cats) {
                if (categories[cat] === undefined) {
                    categories[cat] = 0;
                }
                categories[cat]++;
            }

            for (let subcat of subcats) {
                if (subcategories[subcat] === undefined) {
                    subcategories[subcat] = 0;
                }
                subcategories[subcat]++;
            }
        }


        // sort categories by number of entries
        let sortedCategories = Object.keys(categories).sort(function (a, b) { return categories[b] - categories[a]; });
        let sortedSubcategories = Object.keys(subcategories).sort(function (a, b) { return subcategories[b] - subcategories[a]; });



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
            categoryButtons.push(<button className={className} key={i} onClick={() => { this.catClick(cat); }}> {catName} </button>);
        }

        // create subcategory buttons
        let subcategoryButtons = [];
        for (let i = 0; i < sortedSubcategories.length && i < this.state.maxSubcategories; i++) {
            let subcat = sortedSubcategories[i];
            let className = 'al-button subcategory-button ' + catSelected(subcat, this.state.subcategories);
            let subcatName = subcat.charAt(0).toUpperCase() + subcat.slice(1);
            subcategoryButtons.push(<button className={className} key={i} onClick={() => { this.subcatClick(subcat); }}> {subcatName} </button>);
        }


        return (
            <div>
                <div className="libMenu">
                    <div className="libMenuTitleBar">
                        <h1 className="libMenuTitle">Library</h1>
                        <input className="libMenuSearch" type="text" placeholder="Search" onChange={(event) => { this.searchChange(event); }} />

                    </div>
                    <div className="libMenuFilterBar">
                        {filterButtons}
                    </div>
                    <div className="libMenuCategoryBar">
                        {categoryButtons}
                    </div>
                    <div className="libMenuSubcategoryBar">
                        {subcategoryButtons}
                    </div>


                </div>
                <LibList library={library} />
            </div>
        );
    }
}

export default LibMenu;