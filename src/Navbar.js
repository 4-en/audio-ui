import React from 'react';
import { Link } from 'react-router-dom';
import { userModeToggle } from './dark-light-toggle';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null
        };
    }

    async testLogin() {
        if (this.state.username) {
            return;
        }
        const username = 'Bob';
        const password = '1234';

        const res = await this.props.app.login(username, password);

        if (res) {
            // wait
            this.setState({ username: "not null" });
        }

    }

    render() {
        let loginLabel = "exception";
        try {
            loginLabel = this.state.username !== null ? this.props.app.state.user.username : 'Test Login';
        } catch (e) {
            console.log(e);
        }

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
                    <button className='navbar-item' onClick={() => { this.testLogin(); }}>{loginLabel}</button>
                </div>
            </div>
        );
    }
}

export default Navbar;