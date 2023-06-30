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
            mode: "create"
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
        item[key] = value;
        this.setState({ item: item });
    }

    getInner() {
        if (this.state.item === null) {
            return null;
        }

        return (
            <div className="editItemContent">
                {this.createRow("Name", <input type="text" value={this.state.item.name} onChange={(e) => { this.changeKV("name", e.target.value); }} />)}
                {this.createRow("Price", <input type="text" value={this.state.item.price} onChange={(e) => { this.changeKV("price", e.target.value); }} />)}

            </div>
        );
    }

    getButtons() {
        if (this.state.mode === "create") {
            return (
                <div className="editItemButtons">
                    <button className="al-button" onClick={() => { this.close(); }}>Cancel</button>
                    <button className="al-button" onClick={() => { this.close(); }}>Create</button>
                </div>
            );

        } else {
            return (
                <div className="editItemButtons">
                    <button className="al-button" onClick={() => { this.close(); }}>Cancel</button>
                    <button className="al-button" onClick={() => { this.close(); }}>Save</button>
                    <button className="al-button" onClick={() => { this.close(); }}>Delete</button>
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

        this.editItem = React.createRef();



    }

    async componentDidMount() {
        if (this.props.app.state.user !== null) {
            this.setState({ username: this.props.app.state.user.username, balance: this.props.app.state.user.balance });
        }
    }

    async createItem(e) {
        this.editItem.current.showCreate({ name: "Test", price: 0 });

    }

    render() {

        let isAdmin = true;

        return (
            <div className="Store">
                {isAdmin ? <div>
                    <EditItemView ref={this.editItem} item={null} />
                    <button className="al-button createItemButton" onClick={(e) => { this.createItem(e); }}>Create Item</button>
                </div> : null}
                {this.state.username === "null" ? null :
                    <div className="store_header">

                        <div>
                            Username: {this.state.username}
                        </div>
                        <div>
                            Balance: {getPriceString(this.state.balance)}
                        </div>



                    </div>
                }
                <LibMenu isStore={true} app={this.props.app} store={this} />
            </div>
        );
    }
}

export default Store;