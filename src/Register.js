import React, {useState} from 'react';
import { Form, Link } from 'react-router-dom';


class Register extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        passwordfb: ' ',
        password: '',
        usernamefb: ' ',
        loginfb: ' ',
    }

    async handleSubmit(e) {
        e.preventDefault();

       

        var first=e.target.uname.value;
        var second=e.target.pword.value;
        var third=e.target.mail.value;
        
        
        if (first.length<5||first.length>20){
            this.setState({loginfb: "unsuccessful registration"});
            return;
        }
        if(second.length<5||second.length>20){
            this.setState({loginfb: "unsuccessful registration"});
            return;
        }
       

        let res = await this.props.app.register(first, second, third);
        if (res) {
            // successful login
        } else {
            // unsuccessful login
            this.setState({loginfb: "unsuccessful registration"});
        }
    } 

    validatePassword = e => {
       e.preventDefault();
       //validate password
       if(e.target.value.length<20&&e.target.value.length>=5){
              this.setState({passwordfb: ''});
              this.removefb(e);
              return;
       }
         if(e.target.value.length>20){
            this.setState({passwordfb: "Password must be at most 20 characters long"});
            this.removefb(e);
            return;
         }
         if(e.target.value.length<5){
            this.setState({passwordfb: "Password must be at least 5 characters long"});
            this.removefb(e);
            return;
         }
    }
    validateUsername = e => {
        e.preventDefault();
        //validate username
        if(e.target.value.length<20&&e.target.value.length>=5){
               this.setState({usernamefb: ''});
               this.removefb(e);
               return;
        }
          if(e.target.value.length>20){
             this.setState({usernamefb: "Username must be at most 20 characters long"});
             this.removefb(e);
               return;
          }
          if(e.target.value.length<5){
             this.setState({usernamefb: "Username must be at least 5 characters long"});
             this.removefb(e);
               return;
          }
     }
     removefb = e =>{
        this.setState({loginfb: ""});
    } 
    
    render() {
        const { passwordfb } = this.state;
        const { usernamefb } = this.state;
        const { loginfb } = this.state;
        return (
            <><div>
                
            </div><div>
                    <div className="registerarea">
                       
                        <div>

                            <div>
                                <div className='ltext'>
                                    <h1>Register</h1>
                                </div>
                                <form onSubmit={(e)=>{this.handleSubmit(e);}}>
                                <div>
                                
                                    <input type="text" name='uname' placeholder="username" onChange={this.validateUsername} className="linput name"  />
                                    <div>
                                        </div>
                                        <div className='fbpadding'>
                                        <h5 className='fbtext'>{usernamefb}</h5>
                                        </div>
                                        <div>
                                        
                                            <input type="email" name='mail' placeholder="email"  onChange={this.removefb} className="linput name"  />
                                        </div>
                                        </div>
                                        <div className='third-input'>
                                    
                                            <input type="password" name='pword' onChange={this.validatePassword} placeholder="password" className="linput name"  />
                                        </div>
                                        <div className='fbpadding'>
                                        <h5 className='fbtext'>{passwordfb}</h5>
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

export default Register;