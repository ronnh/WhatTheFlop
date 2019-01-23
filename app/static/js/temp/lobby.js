import React from "react";
import socketIOClient from 'socket.io-client';

import { api } from "../api";

var socket = socketIOClient.connect('/room');

/* lobby.js is the room, users wait here */
class Lobby extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			users: [],
			done: false
		};
		//console.log(this.props.roomURL);
	}

	// TODO: Redo with REDUX.
	componentDidMount() {
  		api.getUsernames(this.props.roomId, users => {
			this.setState({
				users: users.data ? users.data : []
			});
		});
		socket.on('user change', data => {
			if (!this.state.done){
		  		api.getUsernames(this.props.roomId, users => {
					this.setState({
						users: users.data ? users.data : []
					});
				});				
			}
		});
	}

	handleAboutToStart(e){
		e.preventDefault();
		this.setState({
			done: true
		});
		this.props.handleStart(e);
	}

    render() {
	    var username = this.props.name;
	    var roomname = this.props.roomname;
	    var roomId = this.props.roomId;
	    var roomURL = this.props.roomURL;
	    var handleStart = this.props.handleStart;

		const listUsers = this.state.users.map((user) => <div key={user}>{user}</div> );

	    return (
	        <div className = "center">
	        	<div id="lobbyText">
	        		<div id="instruct">Hey {username}! Welcome to {roomname}!</div>
	        		<div> Room ID: {roomId} </div>
	        		<div> Room URL: {roomURL}</div>
	        		<br />
	        		<div id="instruct-no-margin"> Current users who have joined: </div>
	        		<div> {listUsers} </div>
	        	</div>
	        	<button type="submit" className="btn" onClick={evt => this.handleAboutToStart(evt)}>BEGIN SUGGESTING</button>  
	        </div>
	    );
    }
}

export default Lobby;

