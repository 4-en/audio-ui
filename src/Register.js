import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';
import email from "./images/email.jpg";
import password from "./images/password.png";


class Register extends React.Component {
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
                                    <h1>Register</h1>
                                </div>

                                <div>
                                
                                    <input type="text" placerholder="user name" className="name" />
                                    <div className='second-input'>
                                        </div>
                                        <div>
                                        
                                            <input type="email" placerholder="email" className="name" />
                                        </div>
                                        </div>
                                        <div className='third-input'>
                                    
                                            <input type="password" placerholder="user name" className="name" />
                                        </div>
                                    
                                <div className='paddingbutton'>
                                    <div className='lbutton'>
                                        <button className='lb'>
                                            Register
                                        </button>
                                    </div>
                                </div>

                                <p className='reg'>
                                    <a href='store'>Login</a>
                                </p>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Register;