import React from 'react';
import { Link } from 'react-router-dom';
import LibMenu from './LibMenu';

function getPriceString(price) {
    price = price / 100;
    return price.toFixed(2) + "€";
}

class EditItemView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            mode: "create",
            errorMsg: ""
        }
    }

    showEdit(item) {
        let d = document.getElementById("editItemDialog");
        d.showModal();
        this.setState({ item: item, mode: "edit" });
    }

    showCreate(item) {
        let d = document.getElementById("editItemDialog");
        d.showModal();
        this.setState({ item: item, mode: "create" });
    }

    close() {
        let d = document.getElementById("editItemDialog");
        this.setState({ item: null });
        d.close();
    }


    createRow(name, value) {
        return (
            <div className="editItemRow">
                <div className="editItemRowName">
                    {name}
                </div>
                <div className="editItemRowValue">
                    {value}
                </div>
            </div>
        );
    }

    changeKV(key, value) {
        let item = this.state.item;

        if (key === "Author") {
            let names = value.split(" ");
            if (names.length === 1) {
                names.push("");
            } else if (names.length > 2) {
                while (names.length > 2) {
                    names[0] += " " + names[1];
                    names.splice(1, 1);
                }
            }
            item.author["first_name"] = names[0];
            item.author["last_name"] = names[1];
        } else if (key === "Categories") {
            let split = value.split(",");
            split = split.map((s) => { return s.trim(); });
            item["categories"] = split;
        } else if (key === "Release Date") {
            let date = new Date(value);
            // get the unix timestamp
            item["releaseDate"] = Math.floor(date.getTime() / 1000);
        } else {
            item[key] = value;
        }

        this.setState({ item: item });
    }

    updateItem() {
        let item = this.state.item;

        let title = document.getElementById("editStoreItemTitle").value;
        if (title !== "") {
            item.title = title;
        } else {
            return "Title is required";
        }

        let series = document.getElementById("editStoreItemSeries").value;
        if (series !== "") {
            item.series = series;
        }

        let series_index = document.getElementById("editStoreItemSeriesIndex").value;
        if (series_index !== "") {
            // to int
            try {
                item.series_index = parseInt(series_index);
            } catch (e) {
                if (series !== "") {
                    console.log(e);
                    return "Series index must be a number";
                }

            }
        }

        let author = document.getElementById("editStoreItemAuthor").value;
        if (author !== "") {
            let names = author.split(" ");
            if (names.length === 1) {
                names.push("");
            } else if (names.length > 2) {
                while (names.length > 2) {
                    names[0] += " " + names[1];
                    names.splice(1, 1);
                }
            }
            item["author"]["first_name"] = names[0];
            item["author"]["last_name"] = names[1];
        } else {
            return "Author is required";
        }

        let categories = document.getElementById("editStoreItemCategories").value;
        if (categories !== "") {
            let split = categories.split(",");
            split = split.map((s) => { return s.trim(); });
            item["categories"] = split;
        } else {
            return "At least one category is required. Separate multiple categories with a comma";
        }

        let releaseDate = document.getElementById("editStoreItemRelease").value;
        if (releaseDate !== "") {
            let date = new Date(releaseDate);
            // get the unix timestamp
            let releaseSeconds = Math.floor(date.getTime() / 1000);
            if (isNaN(releaseSeconds)) {
                return "Release date must be a valid date";
            }
            item["releaseDate"] = releaseSeconds;
        }

        let duration = document.getElementById("editStoreItemDuration").value;
        if (duration !== "") {
            // to int
            try {
                let hours = 0;
                let minutes = 0;
                let seconds = 0;

                let split = duration.split(" ");
                for (let i = 0; i < split.length; i++) {
                    let s = split[i];
                    if (s.endsWith("h")) {
                        hours = parseInt(s.replace("h", ""));
                    } else if (s.endsWith("m")) {
                        minutes = parseInt(s.replace("m", ""));
                    } else if (s.endsWith("s")) {
                        seconds = parseInt(s.replace("s", ""));
                    } else {
                        return "Duration must be a number in the format xh ym zs";
                    }
                }

                if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
                    return "Duration must be a number in the format xh ym zs";
                }

                item["duration"] = (hours * 60 * 60) + (minutes * 60) + seconds;

            } catch (e) {
                console.log(e);
                return "Duration must be a number in the format xh ym zs";
            }
        }

        let price = document.getElementById("editStoreItemPrice").value;
        if (price !== "") {
            // to int
            try {
                // remove the €
                price = price.replace("€", "");

                // split at the .
                let split = price.split(".");
                if (split.length === 1) {
                    // no . found
                    split.push("00");
                } else if (split.length > 2) {
                    // more than one . found
                    while (split.length > 2) {
                        split[0] += "." + split[1];
                        split.splice(1, 1);
                    }
                }


                // join
                price = split.join("");


                // to int
                price = parseInt(price);

                // check if nan
                if (isNaN(price)) {
                    return "Price must be a number in the format 0.00";
                }

                item.price = price;

            } catch (e) {
                console.log(e);
                return "Price must be a number in the format 0.00";
            }
        }

        this.setState({ item: item });

        return item;
    }





    getInner() {
        if (this.state.item === null) {
            return null;
        }

        /*
        audio_type: int,
        title: str,
        author_id: int|None,
        author_first_name: str|None,
        author_last_name: str|None,
        author_bio: str|None,
        categories: str,
        series: str,
        duration: int,
        rating: float,
        price: int,
        cover_file: str,
        releaseDate: int,
        series_index: int
        */
        let categories = "";
        console.log(this.state.item.categories);
        for (let i = 0; i < this.state.item.categories.length; i++) {
            categories += this.state.item.categories[i];
            if (i < this.state.item.categories.length - 1) {
                categories += ", ";
            }
        }
        console.log(categories);

        let author = this.state.item.author.first_name + " " + this.state.item.author.last_name;
        let durationH = Math.floor(this.state.item.duration / 3600);
        let durationM = Math.floor((this.state.item.duration - durationH * 3600) / 60);
        let durationS = this.state.item.duration - durationH * 3600 - durationM * 60;
        let duration = durationH + "h " + durationM + "m " + durationS + "s";

        let releaseDate = new Date(this.state.item.releaseDate * 1000);
        let releaseDateString = releaseDate.getFullYear() + "-" + (releaseDate.getMonth() + 1) + "-" + releaseDate.getDate();

        let price = getPriceString(this.state.item.price);



        return (
            <div className="editItemContent">
                {this.createRow("Title", <input id="editStoreItemTitle" type="text" defaultValue={this.state.item.title} />)}
                {this.createRow("Series", <input id="editStoreItemSeries" type="text" defaultValue={this.state.item.series} />)}
                {this.createRow("Series Index", <input id="editStoreItemSeriesIndex" type="text" defaultValue={this.state.item.series_index} />)}
                {this.createRow("Author", <input id="editStoreItemAuthor" type="text" defaultValue={author} />)}
                {this.createRow("Categories", <input id="editStoreItemCategories" type="text" defaultValue={categories} />)}
                {this.createRow("Duration", <input id="editStoreItemDuration" type="text" defaultValue={duration} />)}
                {this.createRow("Release Date", <input id="editStoreItemRelease" type="text" defaultValue={releaseDateString} />)}
                {this.createRow("Price", <input id="editStoreItemPrice" type="text" defaultValue={price} />)}
            </div>
        );
    }

    async createItem() {
        let item = this.updateItem();

        // check if item is string
        if (typeof item === "string") {
            // error
            this.setState({ error: item });
            return;
        } else {
            this.setState({ error: null });
        }

        // api call
        const res = await this.props.app.apiRequest("/create_item", "POST",{
            session_id: this.props.app.state.user.session_id,
            item_audio_type: item.audio_type,
            item_title: item.title,
            item_author_first_name: item.author.first_name,
            item_author_last_name: item.author.last_name,
            item_author_bio: item.author.bio,
            item_categories: item.categories,
            item_series: item.series,
            item_duration: item.duration,
            item_rating: item.rating,
            item_price: item.price,
            item_cover_file: item.cover_file,
            item_release_date: item.releaseDate,
            item_series_index: item.series_index
        });

        if (res.status !== 200) {
            // error
            this.setState({ error: res.message });
            return;
        }

        // alert
        alert("Created item: " + item.title);

        this.close();

    }

    async editItem() {
        let item = this.updateItem();

        // check if item is string
        if (typeof item === "string") {
            // error
            this.setState({ error: item });
            return;
        } else {
            this.setState({ error: null });
        }

        const id = this.state.item.content_id;

        // api call
        const res = await this.props.app.apiRequest("/edit_item", "POST",{
            session_id: this.props.app.state.user.session_id,
            item_id: id,
            changes: {
                title: item.title,
                price: item.price,
                series: item.series,
                series_index: item.series_index,
                releaseDate: item.releaseDate,
                duration: item.duration,
                categories: item.categories
            }
        });

        if (res.status !== 200) {
            // error
            this.setState({ error: res.message });
            return;
        }

        // alert
        alert("Changed item: " + item.title);

        this.close();
    }

    async deleteItem() {
        // api call
        console.log("delete");
        const id = this.state.item.content_id;
        console.log(id);

        // delete item with id
        const res = await this.props.app.apiRequest("/delete_item", "POST",{
            session_id: this.props.app.state.user.session_id,
            item_id: id
        });

        if (res.status !== 200) {
            // error
            this.setState({ error: res.message });
            return;
        }

        // alert
        alert("Deleted item with id: " + id);

        this.close();

    }



    getButtons() {
        if (this.state.mode === "create") {
            return (
                <div className="editItemButtons">
                    <button className="al-button" onClick={() => { this.close(); }}>Cancel</button>
                    <button className="al-button" onClick={async () => { await this.createItem(); }}>Create</button>
                </div>
            );

        } else {
            return (
                <div className="editItemButtons">
                    <button className="al-button" onClick={() => { this.close(); }}>Cancel</button>
                    <button className="al-button" onClick={async () => { await this.editItem(); }}>Edit</button>
                    <button className="al-button" onClick={async () => { await this.deleteItem(); }}>Delete</button>
                </div>
            );
        }
    }

    render() {


        return (
            <dialog className="editItemDialog" id="editItemDialog">
                <div className="editItemHeader">
                    {this.state.mode === "create" ? "Create Item" : "Edit Item"}
                    <button className="al-button" onClick={() => { this.close(); }}>Close</button>
                </div>
                {this.getInner()}
                {this.state.error !== "" ? <div className="editItemError">{this.state.error}</div> : null}
                {this.getButtons()}
            </dialog>
        );
    }
}



class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "null",
            balance: 0
        }

        this.editItemView = React.createRef();



    }

    async componentDidMount() {
        if (this.props.app.state.user !== null) {
            this.setState({ username: this.props.app.state.user.username, balance: this.props.app.state.user.balance });
        }
    }

    async createItem(e) {

        const newItem = {
            audio_type: 0,
            title: "New Item",
            author: {
                first_name: "First",
                last_name: "Last",
                bio: "Bio"
            },
            categories: [],
            series: "",
            duration: 60 * 60,
            rating: 0,
            price: 1000,
            cover_file: "no-cover.jpg",
            releaseDate: Math.floor(Date.now() / 1000),
            series_index: 0

        }

        this.editItemView.current.showCreate(newItem);

    }

    editItem(item) {
        this.editItemView.current.showEdit(item);
    }

    render() {

        let isAdmin = true;
        if (this.props.user !== null) {
            isAdmin = this.props.user.admin;
        } else {
            isAdmin = false;
        }

        return (
            <div className="Store">
                {this.props.user === null ? null :
                    <div className="store_header">

                        {isAdmin ? <div>
                            <EditItemView ref={this.editItemView} app={this.props.app} item={null} />
                            <button className="rightPanelBuyButton" onClick={(e) => { this.createItem(e); }}>Create Item</button>
                        </div> : null}

                        <Link to="/charge" className="rightPanelBuyButton chargeBalanceButton">{getPriceString(this.props.user.balance)}</Link>



                    </div>
                }
                <LibMenu isStore={true} app={this.props.app} store={this} />
            </div>
        );
    }
}

export default Store;