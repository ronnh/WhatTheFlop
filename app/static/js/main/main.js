import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import Signup from "./signup";
import Credit from "./credit";
import Profile from "./profile";
import { api } from "../api";



/* main.js is the class that handles the main page*/
export default class Main extends React.Component {
    constructor(props){
        super(props);
        if (api.getCurrentUser()){
            this.state = {
                page: "profile"
            };
        } else {
            this.state = {
                page: "signup"
            };
        }
        var handleCredit = this.handleCredit.bind(this);
        var handleSignupPage = this.handleSignupPage.bind(this);
        var handleProfilePage = this.handleProfilePage.bind(this);
    }

    handleCredit(evt) {
        evt.preventDefault();
        this.setState({
            page: "credit"
        });
    }

    handleSignupPage(evt) {
        evt.preventDefault();
        this.setState({
            page: "signup"
        });
    }

    handleProfilePage(evt) {
        evt.preventDefault();
        this.setState({
            page: "profile"
        });
    }

	render() {
		var handleRoom = this.props.handleRoom;
        var handleCredit = this.handleCredit;
        var handleSignupPage = this.handleSignupPage;
        var handleProfilePage = this.handleProfilePage;
        if (this.state.page === "signup"){
              return (
                <div className = "Main">
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img src="../media/logo.png" id="logo"></img></a>
                        </div>
                        <Navbar />
                        <Sidebar handleRoom={handleRoom} handleCredit={handleCredit.bind(this)} handleSignupPage={handleSignupPage.bind(this)} handleProfilePage={handleProfilePage.bind(this)} />
                    </nav>
                    <Signup />
                </div>
            );
        }
        else if (this.state.page === "credit"){
            return (
                <div className = "Main">
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img src="../media/logo.png" id="logo"></img></a>
                        </div>
                        <Navbar />
                        <Sidebar handleRoom={handleRoom} handleCredit={handleCredit.bind(this)} handleSignupPage={handleSignupPage.bind(this)} handleProfilePage={handleProfilePage.bind(this)} />
                    </nav>
                    <Credit />
                </div>
            );
        }else if (this.state.page == "profile"){
            return (
                <div className = "Main">
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img src="../media/logo.png" id="logo"></img></a>
                        </div>
                        <Navbar />
                        <Sidebar handleRoom={handleRoom} handleCredit={handleCredit.bind(this)} handleSignupPage={handleSignupPage.bind(this)} handleProfilePage={handleProfilePage.bind(this)} />
                    </nav>
                    <Profile />
                </div>
            );
        }
	}
}
