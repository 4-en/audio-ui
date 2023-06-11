import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';
import email from "./images/email.jpg";
import password from "./images/password.png";

function handleSubmit(e) {
    //TODO: real registration
    e.preventDefault();
    var first=e.target.uname.value;
    var second=e.target.pword.value;
    var third=e.target.mail.value;
    console.log("Username: "+first,"\n","Password: "+second,"\n","Email: "+third)
} 

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    submitregister(){
        
        console.log(this.email);
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
                                <form onSubmit={handleSubmit}>
                                <div>
                                
                                    <input type="text" name='uname' placeholder="username" className="name" />
                                    <div className='second-input'>
                                        </div>
                                        <div>
                                        
                                            <input type="email" name='mail' placeholder="email"  className="name" />
                                        </div>
                                        </div>
                                        <div className='third-input'>
                                    
                                            <input type="password" name='pword' placeholder="password" className="name" />
                                        </div>
                                    
                                <div className='paddingbutton'>
                                    <div className='lbutton'>
                                        <button onClick={this.submitregister}  className='lb'>
                                            Register
                                        </button>
                                    </div>
                                </div>
                                </form>
                                <p className='reg'>
                                    <a href='login'>Login</a>
                                </p>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Register;