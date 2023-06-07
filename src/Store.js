import React from 'react';
import { Link } from 'react-router-dom';
import LibMenu from './LibMenu';

function getPriceString(price) {
    price = price / 100;
    return price.toFixed(2) + "€";
}

class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "null",
            balance: 0
        }



    }

    async componentDidMount() {
        if (this.props.app.state.user !== null) {
            this.setState({ username: this.props.app.state.user.username, balance: this.props.app.state.user.balance });
        }
    }

    render() {
        return (
            <div className="Store">
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