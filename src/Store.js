import React from 'react';
import { Link } from 'react-router-dom';
import LibMenu from './LibMenu';

class Store extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Store">
                <div className="store_header">
                    Show some user info here
                    <div>
                        Username: someuser
                    </div>
                    <div>
                        Balance: $0.00
                    </div>

                </div>
                <LibMenu isStore={true} app={this.props.app} />
            </div>
        );
    }
}

export default Store;