import React from "react";

import { api } from "../api"

/* signup.js is the page for signup */
class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            verifyPassword: '',
		    retMessage: '',
            error: ''
        };
        this.handleSignup = this.handleSignup.bind(this);
    }

    handleSignup(e, username, password, verifyPassword){
        e.preventDefault();
        if (password == verifyPassword){
            api.signup(username, password, response => {
                this.setState({
                    username: '',
                    password: '',
                    verifyPassword: '',
					retMessage: "Congratulations your account has been created!",
                    error: '',
                });
            },
            error => {
                this.setState({
                    error: error.response.data.message,
                    retMessage: ''
                });
            });
        } else {
			this.setState({
					password: '',
					verifyPassword: '',
					error: "Passwords do not match.",
                    retMessage: ''
			})
        }
    };

    render(){
        return (
            <div className="page-login">
                <div className="panel-body">
                    <div className="mypanel-title">Sign up for WhatTheFlop!</div>
                    <div className="mypanel-text">Connect with your friends to create, decide and share events and brag about events you have been to!</div>
                    { this.state.error != '' ?
                        <div className="error"> {this.state.error} </div>
                        : null
                    }
                    { this.state.retMessage != '' ?
                        <div className="signup-success"> {this.state.retMessage} </div>
                        : null
                    }                    
                    <form className="signup_form" onSubmit={e => this.handleSignup(e, this.state.username, this.state.password, this.state.verifyPassword)}>
                        <input type="text" name="username" className="form" placeholder="Enter a username" value={this.state.username} onChange={evt => this.updateUsername(evt)} required/>
                        <input type="password" name="password" className="form" placeholder="Enter a password" value={this.state.password} onChange={evt => this.updatePassword(evt)} required/>
                        <input type="password" name="verify-password" className="form" placeholder="Verify password" value={this.state.verifyPassword} onChange={evt => this.updateVerifyPassword(evt)} required/>
                        <button id="signup" type="submit" className="signup-btn" >SIGN UP</button>
                    </form>
                </div>
            </div>
        );
    }

    updateUsername(evt){
        this.setState({
            username: evt.target.value
        });
    };

    updatePassword(evt){
        this.setState({
            password: evt.target.value
        });
    };

    updateVerifyPassword(evt){
        this.setState({
            verifyPassword: evt.target.value
        });
    };
}

export default Signup;
