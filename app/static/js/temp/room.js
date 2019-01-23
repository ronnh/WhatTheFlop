import React from "react";
import socketIOClient from 'socket.io-client';

import EnterName from "./enterName";
import Opt from "./opt";
import Join from "./join";
import Create from "./create";
import Lobby from "./lobby";
import Suggestion from "./suggestion";
import Waiting from "./waiting";
import Order from "./order";
import RankWaiting from "./rankWaiting";
import Result from "./result";

import { api } from "../api";

const queryString = require('query-string');
var socket = socketIOClient.connect('/room');

//var socket = socketIOClient.connect('/room');

/* room.js is the class that handles the different steps of the ranking process */
class Room extends React.Component {

    constructor(props){
        super(props);
        
        var handleUsername = this.handleUsername.bind(this);
        var handleOptionToCreate = this.handleOptionToCreate.bind(this);
        var handleOptionToJoin = this.handleOptionToJoin.bind(this);
        var handleJoin = this.handleJoin.bind(this);
        var handleCreate = this.handleCreate.bind(this);
        var handleStart = this.handleStart.bind(this);
        var handleSubmission = this.handleSubmission.bind(this);
        var handleWaiting = this.handleWaiting.bind(this);
        var handleOrder = this.handleOrder.bind(this);
        var handleRankWaiting = this.handleRankWaiting.bind(this);
        var handleResult = this.handleResult.bind(this);

        var handleBackToName = this.handleBackToName.bind(this);
        var handleBackToOption = this.handleBackToOption.bind(this);

        var setError = this.setError.bind(this);

        if(this.props.roomid){
            this.state = {
                step: "enter",
                userId: 0,
                roomId: this.props.roomid, 
                username: "",
                roomname: "",
                result: "",
                roomURL: "",
                error: ""
            };
        }else {
            this.state = {
                step: "enter",
                userId: 0,
                roomId: 0, 
                username: "",
                roomname: "",
                result: "",
                error: ""
            };
        }
    }

    dismiss(){
        this.props.handleRoomUnmount();
    }

    componentDidMount() {
        var userId = api.getCurrentUser();
        if (userId){
             api.getUsername(userId, username => {
                this.setState({
                    step: "option",
                    userId: userId,
                    username: username.data
                });
            });       
        }
    }

    // state: enter
    handleUsername(e, username){
        e.preventDefault();
        if (username.length > 32){
            this.setState({
                error: "User name should have less than 32 characters! :("
            })
        } else { 
            if(this.props.roomid){
                var urlComp = window.location.protocol + "//" + window.location.host;
                api.getRoomName(this.props.roomid, roomname => {
                    api.tempUser(username, this.props.roomid, userId => {
                        this.setState({
                            step: "lobby",
                            roomname: roomname.data,
                            roomId: this.props.roomid,
                            userId: userId.data,
                            roomURL: urlComp + "/?room_id=" + this.props.roomid
                        });
                        socket.emit('user change', this.state.username);         
                    },
                    error => {
                        this.setState({
                            error: error.response.data.message
                        });
                    });
                    /*
                    res => {
                        this.setState({
                            error: "The room has already started! Please Create or Join another room!"
                        });
                    }); */           
                },
                error => {
                    this.setState({
                        error: error.response.data.message
                    });
                });
            }else {
                this.setState({
                    step: "option",
                    username: username,
                    error: ''
                });  
            }    
        }
    }

    handleBackToName(e){
        e.preventDefault();
        this.setState({
            step: "enter"
        });
    }

    handleBackToOption(e){
        e.preventDefault();
        this.setState({
            step: "option"
        });
    }

    // state: option
    handleOptionToCreate(e){
        e.preventDefault();
        this.setState({
            step: "create"
        });
    }

    //s state: option
    handleOptionToJoin(e){
        e.preventDefault();
        this.setState({
            step: "join"
        });
    }

    // state: create
    handleCreate(e, roomname){
        e.preventDefault();
        if (roomname.length > 32){
            this.setState({
                error: "Room name should have less than 32 characters! :( "
            });
        } else {
            api.createRoom(roomname, roomId => {
                api.tempUser(this.state.username, roomId.data, userId => {
                    var urlComp = window.location.protocol + "//" + window.location.host;
                    this.setState({
                        step: "lobby",
                        userId: userId.data,
                        roomname: roomname,
                        roomId: roomId.data,
                        error: '',
                        roomURL : urlComp + "/?room_id=" + roomId.data
                    });
                    socket.emit('user change', this.state.username);
                    this.props.handleNewTempUser(userId.data);
                });
            });            
        }
    }

    // state: join
    handleJoin(e, roomId){
        e.preventDefault();
        if (isNaN(roomId)){
            this.setState({
                error: "There's an invalid character in your ID!"
            });
        }
        else {
            api.getRoomName(roomId, roomname => {
                api.tempUser(this.state.username, roomId, userId => {
                    var urlComp = window.location.protocol + "//" + window.location.host;
                    this.setState({
                        step: "lobby",
                        roomname: roomname.data,
                        roomId: roomId,
                        userId: userId.data,
                        roomURL : urlComp + "/?room_id=" + roomId,
                        err: ''
                    });
                    socket.emit('user change', this.state.username);
                    this.props.handleNewTempUser(userId.data);
                },
                res => {
                    this.setState({
                        error: res.response.data.message
                    });
                });            
            }, 
            res => {
                //console.log(res);
                this.setState({
                    error: res.response.data.message
                });            
            });            
        }

    }

    // state: lobby
    handleStart(e){
        e.preventDefault();
        api.setRoomStatus(this.state.roomId, "voting", res_room => {
            api.setUserStatus(this.state.userId, "voting", res_user => { 
                this.setState({
                    step: "suggestion"
                });
            });
        });
    }

    // state: suggestion
    handleSubmission(e, suggestions){
        e.preventDefault();
        if (suggestions.length < 3){
            this.setState({
                error: "Did you submit 3 or more suggestions?"
            })
        } else {
             api.setUserStatus(this.state.userId, "done", res_user => { 
                this.setState({
                    step: "waiting",
                    suggestions: suggestions,
                    error: ''
                });
                socket.emit('done suggesting', this.state.username);  
            });    
        }
    }

    // state: waiting
    handleWaiting(){    
        this.setState({
            step: "order"
        });
    }

    // state: rank
    handleOrder(e, first, second, third){
        e.preventDefault;
        if ( first == second || second == third || first == second ){
            this.setState({
                error: 'You chose two of the same choices!'
            });
        }
        else if (first && second && third){
              api.rankSuggestion(this.state.roomId, first, second, third, res => {
                api.setUserStatus(this.state.userId, "done", res =>{ 
                    this.setState({
                        step: "rankWaiting",
                        error: ''
                    });
                    socket.emit('done ranking', this.state.username);       
                });
            });          
        } else {
            this.setState({
                error: "Please select different choices!"
            });
        }

    }

    // state: waiting to be ranked
    handleRankWaiting(){
        this.setState({
            step: "result"
        });
    }

    handleResult(evt, first, second, third){
        var handleMain = this.props.handleMain;
        var id = api.getCurrentUser();
        if (id){
            api.myEvent(id, first, second, third, null);
            socket.emit('done room');
        }
        handleMain(evt);
        if(this.props.roomid){
            window.location.href='/';
        }else{
            this.props.handleRoomUnmount();
        }
    }

    setError(msg){
        this.setState({
            error: msg
        })
    }

    render() {
        if (this.state.step === "enter"){
            var handleUsername = this.handleUsername;
             return (
                <div className = "Room">
                    <EnterName handleUsername={handleUsername.bind(this)} error={this.state.error} />
                </div>
             );
        }

        else if (this.state.step === "option"){
            var handleOptionToCreate = this.handleOptionToCreate;
            var handleOptionToJoin = this.handleOptionToJoin;

            var handleBackToName = this.handleBackToName;
            return(
                <div className = "Opt">
                    <Opt enter={this.state.enter} handleOptionToCreate={handleOptionToCreate.bind(this)} handleOptionToJoin={handleOptionToJoin.bind(this)} handleBackToName={handleBackToName.bind(this)} error={this.state.error} />
                </div>
            );
        }

        else if (this.state.step === "create"){
            var handleCreate = this.handleCreate;
            var handleBackToOption = this.handleBackToOption;
            return (
                <div className = "Create">
                    <Create handleCreate={handleCreate.bind(this)} handleBackToOption={handleBackToOption.bind(this)} error={this.state.error} />
                </div>
            );
        }

        else if (this.state.step === "join"){
            var handleJoin = this.handleJoin;
            var handleBackToOption = this.handleBackToOption;
            return (
                <div className = "Join">
                    <Join handleJoin={handleJoin.bind(this)} handleBackToOption={handleBackToOption.bind(this)} error={this.state.error} />
                </div>
            );
        }

        else if (this.state.step === "lobby"){
            var handleStart = this.handleStart;
            return(
                <div className = "Lobby">
                    <Lobby name={this.state.username} roomname={this.state.roomname} roomId={this.state.roomId} roomURL={this.state.roomURL} handleStart={handleStart.bind(this)} />
                </div>
            );
        }

        else if (this.state.step === "suggestion"){
            var handleSubmission = this.handleSubmission;
            var setError = this.setError;
            return (
                <div className = "Suggestion">
                    <Suggestion long={this.props.long} lat={this.props.lat} setError={setError.bind(this)} handleSubmission={handleSubmission.bind(this)} userId={this.state.userId} roomId={this.state.roomId} error={this.state.error} />
                </div>
            );
        }

        else if (this.state.step === "waiting"){
            var handleWaiting = this.handleWaiting;
            return (
                <div className = "Waiting">
                    <Waiting roomId={this.state.roomId} suggestions={this.state.suggestions} handleWaiting={handleWaiting.bind(this)} />
                </div>
            );
        }

        else if (this.state.step === "order"){
            var handleOrder = this.handleOrder;
            return (
                <div className = "Order">
                    <Order roomId={this.state.roomId} userId={this.state.userId} handleOrder={handleOrder.bind(this)} error={this.state.error} />
                </div>
            );
        }

        else if (this.state.step === "rankWaiting"){
            var handleRankWaiting = this.handleRankWaiting;
            return(
                <div className = "RankWaiting">
                    <RankWaiting roomId={this.state.roomId} handleRankWaiting={handleRankWaiting.bind(this)} />
                </div>
            );
        } 

        else if (this.state.step === "result"){
            var handleResult = this.handleResult;
            return(
                <div className = "Result">
                    <Result roomId={this.state.roomId} handleResult={handleResult.bind(this)} />
                </div>
            );
        }
    }
}

export default Room;
