import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';
import email from "./images/email.jpg";
import password from "./images/password.png";


class Login extends React.Component {
    constructor(props) {
        super(props);
    }

 // <img src={password} alt="password" className="email" />
// <img src={password} alt="password" className="email" />
    render() {
        return (
            <><div>
                
            </div><div className="loginmain">
                    <div className='loginsub-main'>
                       
                        <div>

                            <div>
                                <div className='ltext'>
                                    <h1>Login Page</h1>
                                </div>

                                <div>
                                
                                    <input type="text" placerholder="user name" className="name" />
                                </div>
                                <div className='second-input'>
                               
                                    <input type="password" placerholder="user name" className="name" />
                                </div>
                                <div className='paddingbutton'>
                                    <div className='lbutton'>
                                        <button className='lb'>
                                            Login
                                        </button>
                                    </div>
                                </div>

                                <p className='reg'>
                                    <a href='register'>Sign up</a>
                                </p>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Login;