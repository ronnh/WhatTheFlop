import React from "react";

/* credit.js is a class that credits*/
class Credit extends React.Component {
	render(){
		var handleSignup = this.props.handleSignup;
		return(
			<div className="page">
				<div className="panel-body">
					<div className="mypanel-title">About Us</div>
					<div className="mypanel-text">
						More often than not, we face the challenge of deciding activities to do, or places to go 
						among our peers only to not arrive at a decision or people not attending. This is defined 
						as "flopping". What the Flop or WTF is an innovate event planning platform with many features such as: <br />
						<li> easy access event coordinating </li>
						<li> a user profile containing previously attended events</li> 
						<li> the option to link events to your Google Calendar or iCal </li>
					</div>
	    		</div>

				<div className="panel-body">
					<div className="mypanel-title">Credits</div>
					<div className="mypanel-text">
						Developed and Designed by: Ryan Chan, Ronnie Huang, Yeo Sing Ng, THE CUTESILLYBOYS. <br />
						Logo: CUTESILLYBOYS <br />
						User Interface: CUTESILLYBOYS <br />
						Icons: CUTESILLYBOYS and Freepik.com <br />
					</div>
	    		</div>

			</div>
		);
	}
}

export default Credit;