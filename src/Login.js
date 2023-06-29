import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';
//import email from "./images/email.jpg";
//import password from "./images/password.png";


class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
    }
    
    async handleSubmit(e) {
        //TODO: real login
        e.preventDefault();
        var first=e.target.uname.value;
        var second=e.target.pword.value;
        //console.log("Username: "+first,"\n","Password: "+second)
    
        let res = await this.props.app.login(first, second);
        if (res) {
            // successful login
        } else {
            // unsuccessful login
        }
    
    } 
        
    
    render() {
        
        return (
            <><div>
                
            </div><div className="loginmain">
                    <div className='loginsub-main'>
                       
                        <div>

                            <div>
                                <div className='ltext'>
                                    <h1>Login</h1>
                                </div>                          
                                <form onSubmit={(e)=>{this.handleSubmit(e);}}>
                                <div>
                                    
                                    <input className="linput name"  type="text" name='uname' placeholder="Username" />
                                </div>
                                <div className='second-input'>
                               
                                    <input className="linput name" type="password" name='pword' placeholder="Password" />
                                </div>
                                <div className='paddingbutton'>
                                    <div className='lbutton'>
                                        <button className='lb'>
                                            Login
                                        </button>
                                        
                                    </div>
                                    
                                </div>
                                </form>
                                <div className='or'>
                                <h2>or</h2>
                                </div>
                                <p className='lbutton'>
                                    <div className='textpadding'>
                                    <Link className='lb' to="/register">Register</Link>
                                    </div>
                                </p>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Login;