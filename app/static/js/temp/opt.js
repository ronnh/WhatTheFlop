import React from "react";

import { api } from "../api";

/* option.js is where a user chooses join or create a room */
class Opt extends React.Component {
    render() {;
	    var handleOptionToCreate = this.props.handleOptionToCreate;
	    var handleOptionToJoin = this.props.handleOptionToJoin;
	    var handleBackToName = this.props.handleBackToName;
	    return (
	        <div className = "center">
	        	<div id="instruct">Create a new room? Join an existing room?</div>
	        	<div id="createRoom"><button type="button" className="btn" onClick={evt => handleOptionToCreate(evt)}>CREATE ROOM</button></div>
	        	<div id="joinRoom"><button type="button" className="btn" onClick={evt => handleOptionToJoin(evt)}>JOIN EXISTING ROOM</button></div>
	        	{ api.getCurrentUser() ? null : <div id="back"><button type="button" className="btn" onClick={evt => handleBackToName(evt)}>BACK</button></div>}
	        </div>
	    );
    }
}

export default Opt;