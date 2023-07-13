import React from 'react';
import { Link } from 'react-router-dom';
import { userModeToggle } from './dark-light-toggle';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    async testLogin() {
        if (this.props.user !== null) {
            return;
        }
        const username = 'Bob';
        const password = '1234';

        const res = await this.props.app.login(username, password);

    }

    async logout() {
        const res = await this.props.app.logout();
    }

    render() {

        return (
            <div>
                <div className="nav-spacer"></div> {/* spacer div to push content below navbar */}
                <div className="navbar">
                    <Link className='navbar-item' to="/">Home</Link>
                    <Link className='navbar-item' to="/library">Library</Link>
                    <Link className='navbar-item' to="/store">Store</Link>
                    {this.props.user === null ? 
                    <Link className='navbar-item' to="/login">Login</Link> :
                    <button className='navbar-item' onClick={() => { this.logout(); }}>Logout</button>}
                    {this.props.user === null ?
                    <Link className='navbar-item' to="/register">Register</Link> :
                    null}
                    <button className='navbar-item' onClick={() => { userModeToggle(); }}>Theme</button>
                </div>
            </div>
        );
    }
}

export default Navbar;