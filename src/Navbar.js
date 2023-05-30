import React from 'react';
import { Link } from 'react-router-dom';
import { userModeToggle } from './dark-light-toggle';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="nav-spacer"></div> {/* spacer div to push content below navbar */}
                <div className="navbar">
                    <Link className='navbar-item' to="/">Home</Link>
                    <Link className='navbar-item' to="/library">Library</Link>
                    <Link className='navbar-item' to="/store">Store</Link>
                    <Link className='navbar-item' to="/admin">Admin Store</Link>
                    <Link className='navbar-item' to="/login">Login</Link>
                    <button className='navbar-item' onClick={() => { userModeToggle(); }}>Theme</button>
                </div>
            </div>
        );
    }
}

export default Navbar;