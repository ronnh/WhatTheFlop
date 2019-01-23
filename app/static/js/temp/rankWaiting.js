import React from "react";
import socketIOClient from 'socket.io-client';

import { api } from "../api";

var socket = socketIOClient.connect('/room');

/* rankwaiting.js is the room, users wait here for people to finish ranking */
class RankWaiting extends React.Component {
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
				api.setRoomStatus(this.props.roomId, "done", null); 
				this.setState({
					done: true
				});
				this.props.handleRankWaiting();
			}
		});
		socket.on('done ranking', res => {
			api.getNotDoneUsernames(this.props.roomId, users =>  {
				if(!this.state.done){
					this.setState({
						users: users ? users.data : []
					});
					if (users.data.length == 0){
						api.setRoomStatus(this.props.roomId, "done", null); 
						if (!this.state.done){
							this.setState({
								done: true
							});	
						}
						this.props.handleRankWaiting();
					}					
				}
			});
			clearInterval(this.interval);
		});
		// check every minute.
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
					api.setRoomStatus(this.props.roomId, "done", null); 
					if (!this.state.done){
						this.setState({
							done: true
						});	
					}
					this.props.handleRankWaiting();
				}				
			}
		});
	}

	render(){
		var suggestions = this.props.suggestions;

		const listUsers = this.state.users.map((user) => <div key={user}>{user}</div> );

		return (
			<div className="center">
				<div id="instruct">Waiting for people to finish suggesting!</div>
				<div id="extra-margin">
					<div id="instruct-no-margin"> Users current voting: </div>
					<div id="general-text">{listUsers}</div>
				</div>
			</div>
		);
	}
}

export default RankWaiting;

