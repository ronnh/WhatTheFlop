import React from "react";
import DateTime from "react-datetime";
import moment from 'moment'
import { api } from "../api";
import AddToCalendar from 'react-add-to-calendar';

import socketIOClient from 'socket.io-client';
var socket = socketIOClient.connect('/room');

/* credit.js is a class that credits*/
class Profile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userId : api.getCurrentUser(),
			showId: '',
			showEventId: '',
			events : [],
			scheduledEvents: [],
			showVoted: true,
			showUpcoming: true,
			place: '',
			location: '',
			description: '',
			date: '',
			err: '',
			testEvent: {
		      title: 'Sample Event',
		      description: 'This is the sample event provided as an example only',
		      location: 'Portland, OR',
		      startTime: '2016-09-16T20:15:00-04:00',
		      endTime: '2016-09-16T21:45:00-04:00'
		    }
		}
	}

	componentDidMount(){
		api.getUserEvents(this.state.userId, events => {
			this.setState({
				events: events.data
			});
		});
		api.getUserScheduledEvents(this.state.userId, scheduledEvents => {
			this.setState({
				scheduledEvents: scheduledEvents.data
			});
		});
		socket.on('done room', res => {
			api.getUserEvents(this.state.userId, events => {
				this.setState({
					events: events.data
				});
			});
		});
		socket.on('new suggested event', res => {
			api.getUserScheduledEvents(this.state.userId, scheduledEvents => {
				this.setState({
					scheduledEvents: scheduledEvents.data
				});
			});
		});
		// in case socket isn't working. check every minute
		this.interval = setInterval(this.updateEvents.bind(this), 60000);
	}

	componentWillUnmount(){
		clearInterval(this.interval);
	}

	updateEvents(){
		api.getUserEvents(this.state.userId, events => {
			this.setState({
				events: events.data
			});
		});
		api.getUserScheduledEvents(this.state.userId, scheduledEvents => {
			this.setState({
				scheduledEvents: scheduledEvents.data
			});
		});
	}

	handleHideVoted(e){
		e.preventDefault();
		this.setState({
			showVoted: !this.state.showVoted
		});
	}

	handleHideUpcoming(e){
		e.preventDefault();
		this.setState({
			showUpcoming: !this.state.showUpcoming
		});
	}

	handleShowForm(e, res){
		e.preventDefault();
		this.setState({
			showId: res.id == this.state.showId ? '' : res.id,
			place: res.firstPlace.name ? res.firstPlace.name : res.firstPlace,
			location: res.firstPlace.location ? res.firstPlace.location : ''
		});
	}

	updateLocation(e){
		this.setState({
			location: e.target.value
		});
	}

	updateDescription(e){
		this.setState({
			description: e.target.value
		});
	}

	updateDate(e){
		this.setState({
			date: e instanceof moment ? e.toDate() : ''
		});
	}

	handleSubmitEvent(e){
		e.preventDefault();
		api.scheduledEvent(this.state.userId, this.state.place, this.state.location, this.state.description, this.state.date, res => {
			this.setState({
				showId: ''
			});
		});
		socket.emit('new suggested event');
	}

	handleDeleteEvent(e, res){
		e.preventDefault();
		api.deleteScheduledEvent(res.id, null);
		socket.emit('new suggested event');
	}

	handleCalendarEvent(e, res){
		e.preventDefault();
		this.setState({
			showEventId: res.id == this.state.showEventId ? '' : res.id
		});
	}

	formatDate(date){
		var res = moment(date);
		if (res.isValid()){
			return res.format('MM/DD/YYYY h:mm a');
		}
		return "INVALID DATE!! Might have trouble creating a calendar!"
	}

	render(){
		const calendarItems = []
		return(
			<div className="page">
				<div className="panel-body">
					<div className="mypanel-title">Your Profile</div>
					<div className="panel panel-red">
						<div className="panel-red panel-heading">
							<div className="row-event-header">
								<div className="mypanel-header-text">Recently Voted Events</div>
								<div className="mypanel-header-icon" onClick={e => this.handleHideVoted(e)}></div>
							</div>
						</div>
						{this.state.showVoted ? 
							<div id="mypanel" className="list-group">
								{this.state.events.map(res => {
									return (
										<div id="list-events" className="list-group-item" key={res.id}> 
												{ !res.firstPlace.name ? 
													<div className="row-event"> 
														<div className="mypanel-body-text">{res.firstPlace} </div> 
														<div className="icons"><div className="new_icon" onClick={e => this.handleShowForm(e, res)}></div></div>
													</div> : 
													<div className="row-event">
														<div className="mypanel-body-text">{res.firstPlace.name}</div>
														<div className="icons"><div className="new_icon" onClick={e => this.handleShowForm(e, res)}></div></div>
														<div className="mypanel-body-text-small">{res.firstPlace.location}</div>
												   </div>							
												}
												{ res.id === this.state.showId ? 
													<div className = "event-form-all">
														<form className="event-form">
															Place: <input type="text" name="placename" className="form" value={this.state.place} readOnly/>
														Location: <input type="text" name="location" className="form" value={this.state.location} placeholder="Enter a location" onChange={e => this.updateLocation(e)}  />
															Description: <input type="text" name="description" className="form" placeholder="Enter a description" onChange={e => this.updateDescription(e)} />
															<button id="signup" type="submit" className="signup-btn"  onClick={e => this.handleSubmitEvent(e)}>CREATE EVENT</button>
														</form>
														<div className="date-time"><DateTime onChange={e => this.updateDate(e)} /></div>
													</div>
													: null
												}
										</div> 
										);
									})
								}
							</div> : null
						}
					</div>

					<div className="panel panel-yellow">
						<div className="panel-yellow panel-heading">
							<div className="row-event-header">
								<div className="mypanel-header-text">Upcoming Scheduled Events</div>
								<div className="mypanel-header-icon" onClick={e => this.handleHideUpcoming(e)}></div>
							</div>
						</div>
						{ this.state.showUpcoming ? 
							<div id="mypanel" className="list-group">
								{ this.state.scheduledEvents.map(res => {
									return (
										<div id="list-scheduled" className="list-group-item" key={res.id}>
												<div className="row-event"> 
													<div className="mypanel-body-text">Place: {res.place} </div>
													<div className="icons">
													<div className="calendar_icon" onClick={e=>this.handleCalendarEvent(e, res)}></div>
													<div className="delete_icon" onClick={e => this.handleDeleteEvent(e, res)}></div></div>
													<div className="mypanel-body-text">Date: {this.formatDate(JSON.parse(res.date))} </div> 
													<div className="mypanel-body-text-small">Location: {res.location}</div>
													<div className="mypanel-body-text-small">Description: {res.description}</div>
												</div> 
												{ res.id === this.state.showEventId ?
													<div id="calendar-event"> 
															<AddToCalendar event={{title: res.place, 
																			   description: res.description, 
																			   location: res.location, 
																			   startTime: this.formatDate(JSON.parse(res.date)),
																			   endTime: this.formatDate(JSON.parse(res.date))}}
																		  	buttonLabel="Add to Calendar!"
																		  	listItems={[{ google: 'Google'}, { apple: 'iCal'}]}/>
													</div>
													: null
												}
										</div> 
										);
									})
								}
							</div> : null
						}
					</div>

	    		</div>
			</div>
		);
	}
}

export default Profile;
