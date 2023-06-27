import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';
import email from "./images/email.jpg";
import password from "./images/password.png";



class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    async handleSubmit(e) {
        //TODO: real registration
        e.preventDefault();
        var first=e.target.uname.value;
        var second=e.target.pword.value;
        var third=e.target.mail.value;
        
        let res = await this.props.app.register(first, second, third);
        if (res) {
            // successful login
        } else {
            // unsuccessful login
        }
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
                                <form onSubmit={(e)=>{this.handleSubmit(e);}}>
                                <div>
                                
                                    <input type="text" name='uname' placeholder="username" className="linput name"  />
                                    <div className='second-input'>
                                        </div>
                                        <div>
                                        
                                            <input type="email" name='mail' placeholder="email"  className="linput name"  />
                                        </div>
                                        </div>
                                        <div className='third-input'>
                                    
                                            <input type="password" name='pword' placeholder="password" className="linput name"  />
                                        </div>
                                    
                                <div className='paddingbutton'>
                                    <div className='lbutton'>
                                        <button  className='lb'>
                                            Register
                                        </button>
                                    </div>
                                </div>
                                <div className='or'>
                                <h2>or</h2>
                                </div>
                                </form>
                                <p className='lbutton'>
                                    <div className='textpadding'>
                                    <Link className='lb' to="/login">Login</Link>
                                    </div>
                                </p>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Register;