import React from "react";

/* page.js renders the current page that the user is on */
class Page extends React.Component {
	render() {
		var handleRoom = this.props.handleRoom;
        var handleSignup = this.props.handleSignup;
        var authenticated = this.props.authenticated;
        if (!authenticated){
            return (
                <div className = "Main">
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img src="../media/logo.svg" id="logo"></img></a>
                        </div>
                        <Navbar authenticated={authenticated} />
                        <Sidebar handleRoom={handleRoom} authenticated={authenticated}/>
                    </nav>
                    <Signup handleSignup={handleSignup} />
                </div>
            );           
        } 
        else {
            return (
                <div className = "Main">
                    <nav className="navbar navbar-default navbar-static-top">
                        <div className="navbar-header">
                            <a className="navbar-brand"><img src="../media/logo.svg" id="logo"></img></a>
                        </div>
                        <Navbar authenticated={authenticated} />
                        <Sidebar handleRoom={handleRoom} authenticated={authenticated}/>
                    </nav>
                </div>
            ); 
        }
	}
}

export default Page;