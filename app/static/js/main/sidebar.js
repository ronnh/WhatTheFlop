import React from "react";
import { api } from "../api";

/* sidebar.js is the sidebar for the main page */
class Sidebar extends React.Component {
	render() {
		var handleRoom = this.props.handleRoom;
		var handleCredit = this.props.handleCredit;
		var handleSignupPage = this.props.handleSignupPage;
        var handleProfilePage = this.props.handleProfilePage;
        var userId = api.getCurrentUser();
		
        if(userId){
            return (
                <div className = "Sidebar">
                    <div className="navbar-default sidebar">
                        <div className="sidebar-nav navbar-collapse">
                            <ul className="nav" id="side-menu">
                                <li className ="sidebar-press" onClick={evt => handleProfilePage(evt)} >
                                    YOUR PROFILE
                                </li>
                                <li className ="sidebar-press" onClick={evt => handleRoom(evt)}>
                                    DECIDE YOUR EVENT
                                </li>
                                <li className ="sidebar-press" onClick={evt => handleCredit(evt)}>
                                    ABOUT US
                                </li>
                            </ul>
                        </div>
                     </div>
                </div>
            );
        }else {
    		return (
    			<div className = "Sidebar">
                    <div className="navbar-default sidebar">
                        <div className="sidebar-nav navbar-collapse">
                            <ul className="nav" id="side-menu">
                                <li className ="sidebar-press" onClick={evt => handleSignupPage(evt)} >
                                    SIGN UP
                                </li>
                                <li className ="sidebar-press" onClick={evt => handleRoom(evt)}>
                                    DECIDE YOUR EVENT
                                </li>
                                <li className ="sidebar-press" onClick={evt => handleCredit(evt)}>
                                    ABOUT US
                                </li>
                            </ul>
                        </div>
                     </div>
    			</div>
    		);
        }		
	}
}

export default Sidebar;