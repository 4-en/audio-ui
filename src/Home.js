import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Home">
                <p>
                    Hello World!
                    This is the home page.
                </p>
                <Link to="/library">Library</Link>
            </div>
        );
    }
}

export default Home;