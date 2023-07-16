import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';


class Login extends React.Component {
    
    constructor(props) {
        super(props);
        
    }
    state = {
        loginfb: ' ',
    }
    async handleSubmit(e) {
        e.preventDefault();
        var first=e.target.uname.value;
        var second=e.target.pword.value;
        
        
        let res = await this.props.app.login(first, second);
        if (res) {
            // successful login
        } else {
            // unsuccessful login
            this.setState({loginfb: "unsuccessful login"});
        }
    
    } 
    removefb = e =>{
        this.setState({loginfb: ""});
    }   
    
    render() {
        const { loginfb } = this.state;
        return (
            <><div>
                
            </div><div>
                    <div className='loginarea'>
                       
                        <div>

                            <div>
                                <div className='ltext'>
                                    <h1>Login</h1>
                                </div>                          
                                <form onSubmit={(e)=>{this.handleSubmit(e);}}>
                                <div>
                                    
                                    <input className="linput name" onChange={this.removefb} type="text" name='uname' placeholder="Username" />
                                </div>
                                <div className='second-input'>
                               
                                    <input className="linput name" onChange={this.removefb} type="password" name='pword' placeholder="Password" />
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
                                <div className='lbutton'>
                                    <div className='textpadding'>
                                    <Link className='lb' to="/register">Register</Link>
                                    </div>
                                </div>
                                <div className='fbpadding2'>
                                        <h5 className='fbtext2'>{loginfb}</h5>
                                        </div>


                            </div>
                        </div>
                    </div>
                </div></>
        );
    }
}

export default Login;