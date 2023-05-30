import React from 'react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Login">
                <p>
                    Hello World!
                    This is the login page.
                </p>
                <Link to="/library">Library</Link>
            </div>
        );
    }
}

export default Login;