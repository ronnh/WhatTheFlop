import React from "react";
import PopupRoom from "./room/popuproom";
import Main from "./main/main";
import Popout from 'react-popout';

const queryString = require('query-string');
import socketIOClient from 'socket.io-client';

import { api } from "./api";
var socket = socketIOClient.connect('/room');

/* app.js is our entry point to the app */
class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            page: "main",
            userId: "",
            tempUserId: "",
            room_id: queryString.parse(window.location.search).room_id,
            long: 0,
            lat: 0
        };
        var handleRoom = this.handleRoom.bind(this);
        var handleMain = this.handleMain.bind(this);
        var handleNewTempUser = this.handleNewTempUser.bind(this);
        this.roomClosed = this.roomClosed.bind(this);
    }

    componentDidMount() {
        this.getMyLocation();
    }

    handleRoom(evt) {
        evt.preventDefault();
        this.setState({
            page: "room"
        });
    }

    handleMain(evt){
        evt.preventDefault();
        this.setState({
            page: "main"
        });
    }

    handleNewTempUser(tempUserId){
        this.setState({
            tempUserId: tempUserId
        });
    }

    roomClosed() {
        this.setState({
            page: "main"
        });
        if (this.state.tempUserId != ""){
            api.deleteTempUser(this.state.tempUserId, null, null);
            res => { socket.emit('user change', null); }
        }
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation
        
        if (location) {
          location.getCurrentPosition((position) => {
            this.setState({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });             
          }, (error) => {
            this.setState({ lat: '0', long: '0' })
          })
        }
    }

    render() {
        if (this.state.room_id){
            var handleMain = this.handleMain;
            var handleRoom = this.handleRoom;
            return (
                <div className = "App">
                    <link href="./css/room.css" rel="stylesheet" />
                    <PopupRoom roomid={this.state.room_id} handleMain={handleMain.bind(this)}/>
                </div>
                );
        }
        else if (this.state.page === "main"){
            var handleRoom = this.handleRoom;
            return (
                <div className = "App">
                    <Main handleRoom={handleRoom.bind(this)}  />
                </div>
            );
        }
        else if (this.state.page === "room"){
            var handleMain = this.handleMain;
            var handleRoom = this.handleRoom;
            var handleNewTempUser = this.handleNewTempUser;
            return (
                <div className = "App">
                    <Main handleRoom={handleRoom.bind(this)} />
                    <Popout url="room.html" title="WhatTheFlop" options={{height: '600px', width: '600px'}} onClosing={this.roomClosed} >
                        <PopupRoom long={this.state.long} lat={this.state.lat} handleMain={handleMain.bind(this)} handleNewTempUser={handleNewTempUser.bind(this)} />
                    </Popout>
                </div>
                );
        }
        else {
            return (
                <div className = "App">
                    INVALID PHASE
                </div>
                );
        }
    }
}

export default App;
