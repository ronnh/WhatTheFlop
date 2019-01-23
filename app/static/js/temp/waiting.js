import React from "react";
import socketIOClient from 'socket.io-client';

import { api } from "../api";

var socket = socketIOClient.connect('/room');

/* waiting.js is the room, users wait here for people to finish suggesting */
class Waiting extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			users:[],
			done: false
		};
		this.interval = null;
	}

	componentDidMount(){
		api.getNotDoneUsernames(this.props.roomId, users =>  {
			this.setState({
				users: users ? users.data : []
			});
			if (users.data.length == 0){
				api.setRoomStatus(this.props.roomId, "ranking", null);
				this.setState({
					done: true
				});
				this.props.handleWaiting();
			}
		});
		socket.on('done suggesting', res => {
			api.getNotDoneUsernames(this.props.roomId, users =>  {
				if (!this.state.done){
					this.setState({
						users: users ? users.data : []
					});
					if (users.data.length == 0){
						api.setRoomStatus(this.props.roomId, "ranking", null); 
						if (!this.state.done){
							this.setState({
								done: true
							});	
						}
						this.props.handleWaiting();
					}					
				}

			});
			clearInterval(this.interval);
		});
		// in case socket isn't working. check every minute
		this.interval = setInterval(this.checkIfDone.bind(this), 60000);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	checkIfDone(){
		api.getNotDoneUsernames(this.props.roomId, users =>  {
			if (!this.state.done){
				this.setState({
					users: users ? users.data : []
				});
				if (users.data.length == 0){
					api.setRoomStatus(this.props.roomId, "ranking", null);
					if (!this.state.done){
						this.setState({
							done: true
						});	
					}
					this.props.handleWaiting();
				}
			}
		});
	}

	render(){
		var suggestions = this.props.suggestions;

		const listSuggestions = suggestions.map((suggestion) => <div key={suggestion}>{suggestion}</div> );
		const listUsers = this.state.users.map((user) => <div key={user}>{user}</div> );

		return (
			<div className="center">
				<div id="instruct">Waiting for people to finish suggesting!</div>
				<div id="extra-margin">
					<div id="instruct-no-margin"> Your current suggestions: </div>
					<div id="general-text">{listSuggestions}</div>
				</div>
				<div id="extra-margin">
					<div id="instruct-no-margin"> Users current suggesting: </div>
					<div id="general-text">{listUsers}</div>
				</div>
			</div>
		);
	}
}

export default Waiting;

