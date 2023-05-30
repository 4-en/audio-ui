import React from 'react';
import { Link } from 'react-router-dom';

class Store extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Store">
                <p>
                    Hello World!
                    This is the store page.
                </p>
                <Link to="/library">Library</Link>
            </div>
        );
    }
}

export default Store;