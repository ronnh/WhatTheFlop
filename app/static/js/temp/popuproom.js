import React from "react";
import Room from "./room"

/* popuproom.js is the cladd yhsy holds the container for room*/
class PopupRoom extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			renderRoom: true
		};
		this.handleRoomUnmount = this.handleRoomUnmount.bind(this);
	}

	handleRoomUnmount(){
		this.setState({ renderRoom: false });
	};

    render() {
        var handleMain = this.props.handleMain;
        var handleNewTempUser = this.props.handleNewTempUser;
        return (
            <div className = "room">
                <h1><img src="../media/logo.png" id="logo"></img></h1>
                {this.state.renderRoom ? 
                	<Room long={this.props.long} lat={this.props.lat} roomid={this.props.roomid} handleMain={handleMain} handleRoomUnmount={this.handleRoomUnmount} handleNewTempUser={handleNewTempUser} /> : null 
                }
            </div>
        );
    }
}

export default PopupRoom;
