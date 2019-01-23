import axios from 'axios';

// https://github.com/axios/axios
// https://github.com/flexzuu/react-redux-axios-boilerplate

/* api.js used for api calls, uses axios*/

export const api = {
    // user api
    getCurrentUser,
    setCurrentUser,
    signup,
    signin,
    signout,
    myEvent,
    scheduledEvent,
    getUserScheduledEvents,
    getUsername,
    deleteScheduledEvent,
    // room api
    getUsernames,
    getPollingUsernames,
    getNotDoneUsernames,
    deleteTempUser,
    tempUser,
    createRoom,
    getRoomName,
    getSuggestions,
    searchSuggestion,
    submitSuggestion,
    rankSuggestion,
    setRoomStatus,
    getRoomStatus,
    setUserStatus,
    getResult,
    getUserEvents,
    // calendar api
    authorizeCalendar
};

export default axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/'
});

/*

USER API CALLS
API calls needed for registered users

User: {userId, username}

*/

function getCurrentUser(){
    // var l = document.cookie.split("userId=");
    // if (l.length > 1) return l[1];
    // return null;
    var userId = JSON.parse(localStorage.getItem('userId'));
    return userId ? userId : null;
}

function setCurrentUser(userId){
    localStorage.setItem('userId', JSON.stringify(userId))
}

function signup(username, password, data, error){
    axios.post('/signup/', {
        username: username,
        password: password
    }).then(data).catch(error);
}

function signin(username, password, data, error){
    axios.post('/signin/', {
        username: username,
        password
    }).then(data).catch(error);
}

function signout(data){
    axios.get('/signout/').then(data);
    localStorage.removeItem('userId');
}

function myEvent(userId, firstPlace, secondPlace, thirdPlace, data){
    axios.post('/myevent/'+userId+'/', {
        userId: userId,
        firstPlace: JSON.stringify(firstPlace),
        secondPlace: JSON.stringify(secondPlace),
        thirdPlace: JSON.stringify(thirdPlace)
    }).then(data);
}

function scheduledEvent(userId, title, location, description, date, data){
    axios.post('/'+userId+"/event/", {
        title: title,
        location: location,
        description: description,
        date: JSON.stringify(date)
    }).then(data)
}

function getUserScheduledEvents(userId, data){
    axios.get('/'+userId+'/event/').then(data);
}

function getUserEvents(userId, data){
  axios.get('/myevent/'+userId+'/').then(data);
}

function getUsername(userId, data){
    axios.get('/user/'+userId+'/').then(data);
}

function deleteScheduledEvent(id, data){
    axios.delete('/event/'+id+'/').then(data);
}

/*

ROOM API CALLS
API calls needed for room functionality.

TempUser: {userId, username, roomId, status}
Room: {roomId, roomname, status}
Suggestions: {suggestion, rank} <- rank initially -1

*/

// gets all users given room id
function getUsernames(roomId, data){
    axios.get('/room/'+roomId+'/user/').then(data);
}

// gets all users who are still voting
function getNotDoneUsernames(roomId, data){
    axios.get('/room/'+roomId+'/submitted/').then(data);
}

function getPollingUsernames(roomId, data){
    axios.get('room/'+roomId+"/user/poll/").then(data);
}

// delete tempUser
function deleteTempUser(userId, data, err){
    axios.delete('/room/' + userId + '/').then(data).catch(err);
}

// creates a one time user for the room
function tempUser(username, roomId, data, error){
    axios.post('/room/'+roomId+'/user/',{
        username: username,
    }).then(data).catch(error);
}

// creates a new room
function createRoom(roomname, data){
    axios.post('/room/',{
        roomname: roomname,
        status: "start"
    }).then(data);
}

// get room name
function getRoomName(roomId, data, error){
    axios.get('/room/' + roomId + "/").then(data).catch(error);
}

// search api to get google place results
function searchSuggestion(suggestion, long, lat, data){
    axios.get('/room/search/'+suggestion+"/" + "?long=" + long + "&lat=" + lat).then(data);
}

// post request for a suggestion. backend: set user status, if all status is 2, update room status
function submitSuggestion(userId, roomId, suggestion, suggestionJson, data){
    axios.post("/room/"+roomId+"/suggestion/", {
        userId: userId,
        roomId: roomId,
        suggestion: suggestion,
        suggestionJson: suggestionJson
    }).then(data);
}

// get all done suggestions
function getSuggestions(roomId, data){
    axios.get("/room/"+roomId+"/suggestion/").then(data);
}


// post to rank suggestions
function rankSuggestion(roomId, first, second, third, data){
    axios.post('/room/'+roomId+'/rank/', {
        first: first,
        second: second,
        third: third
    }).then(data);
}

// update room status
function setRoomStatus(roomId, status, data){
    axios.patch('/room/'+roomId+'/status/', {
        status: status
    }).then(data);
}

// get room status
function getRoomStatus(roomId, data){
    axios.get('/room/'+roomId+'/status/').then(data);
}

// set user status
function setUserStatus(userId, status, data){
    axios.patch('/room/user/'+userId+"/status/", {
        status: status
    }).then(data);
}

// get result
function getResult(roomId, data){
    axios.get('/room/'+roomId+'/winner/').then(data);
}

// calendar event
function authorizeCalendar(){
  axios.get('/user/calendar/');
}
