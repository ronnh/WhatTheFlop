import React from "react";
import { api } from "../api";

/* navbar.js is the class that specifies what is on the navbar */
class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            username: '',
            password: '',
            userId: api.getCurrentUser(),
            err: ''
        };
    }

    handleLogin(e, username, password){
        e.preventDefault();
        api.signin(username, password, res => {
            api.setCurrentUser(res.data);
            this.setState({
                userId: res.data
            });
            window.location.reload();
        },
        error => {
            this.setState({
                err: error.response.data.message
            });
        });
    };

    handleLogout(e){
        e.preventDefault();
        api.signout(function(response){
            window.location.reload();
        });
    }

    render() {
        if(this.state.userId){
            return (
                <div className = "Navbar">
                    <ul className="nav navbar-top-links navbar-right">
                        <form className = "signout">
                            <button className="btn" type="button" onClick={evt => this.handleLogout(evt)}>LOGOUT</button>
                        </form>
                    </ul>
                </div>                    
            );
        } else {
            return (
                <div className = "Navbar">
                    <ul className="nav navbar-top-links navbar-right">
                        <form className = "signin">
                            { this.state.err ? <div className="signin-error">{this.state.err}</div> : null }
                            <input type="text" name="username" className="login-email" placeholder="Enter a username" value={this.state.username} onChange={evt => this.updateUsername(evt)}  required/>
                            <input type="password" name="password" className="login-password" placeholder="Enter a password" value={this.state.password} onChange={evt => this.updatePassword(evt)}  required/>
                            <button className="btn" type="button" onClick={evt => this.handleLogin(evt, this.state.username, this.state.password)}>LOGIN</button>
                        </form>
                    </ul>
                </div>                    
            );
        }
    };

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
}

export default Navbar;