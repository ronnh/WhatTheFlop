import operator
import os
from random import randint

import time
from flask import Flask, render_template, request, g, jsonify, session, make_response, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_sslify import SSLify
from werkzeug.security import generate_password_hash, \
    check_password_hash
from flask_socketio import SocketIO, emit
from sqlalchemy import desc

import json
from places import search_places
from wtfCalendar import authorization_url

from whitenoise import WhiteNoise

app = Flask(__name__, static_folder="./static", static_url_path="", template_folder="./static")
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://rojqrdohtpzzyl:5da0b480d1e6b2640c3a981fa2fee9f89f5f7b513a07a3d891f4a851e6fc1d45@ec2-54-83-192-68.compute-1.amazonaws.com:5432/d6ltcb73qk742l'
app.secret_key = b'\xfa3,\xba\xae4\xa0\x0f\xc4\xf7/\xd7\xf2\xc1M\xf8\x02\xbbw\xc2VB&;'

db = SQLAlchemy(app)
app.config.update(dict(
    DEBUG=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax'
))
socketio = SocketIO(app)
sslify = SSLify(app)


@app.route("/.well-known/acme-challenge/<content>", methods=['GET'])
def ssl(content):
    return "MO7shUKwmXnZKv88YbPm01-AD9QnBc4nIk_7WqgTMk8.zNVFGKYa3MO7szvdI0jo8Um9YzNtk0eXYksqADy1BTQ"


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True)
    password = db.Column(db.String(160))

    def __init__(self, username, password):
        self.id = randint(10000000, 99999999)
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %s>' % self.id


class TempUsers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    room_id = db.Column(db.Integer)
    status = db.Column(db.String(32))

    def __init__(self, username, room_id, status):
        self.username = username
        self.room_id = room_id
        self.status = status

    def __repr__(self):
        return '<TempUser %s>' % self.id


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    roomname = db.Column(db.String(32))
    status = db.Column(db.String(32))

    def __init__(self, roomname, status):
        self.id = randint(10000000, 99999999)
        self.roomname = roomname
        self.status = status

    def __repr__(self):
        return '<Room %s>' % self.id


class Suggestions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer)
    suggestion = db.Column(db.String(32))
    suggestion_json = db.Column(db.String(256))

    def __init__(self, room_id, suggestion, suggestion_json):
        self.room_id = room_id
        self.suggestion = suggestion
        self.suggestion_json = suggestion_json

    def __repr__(self):
        return '<Suggestion %s>' % self.id


class Rankings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer)
    suggestion = db.Column(db.String(256))
    rank = db.Column(db.Integer)

    def __init__(self, room_id, suggestion, rank):
        self.room_id = room_id
        self.suggestion = suggestion
        self.rank = rank

    def __repr__(self):
        return '<Ranking %s>' % self.id


class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    place_first = db.Column(db.String(256))
    place_second = db.Column(db.String(256))
    place_third = db.Column(db.String(256))

    def __init__(self, user_id, place_first, place_second, place_third):
        self.user_id = user_id
        self.place_first = place_first
        self.place_second = place_second
        self.place_third = place_third

    def __repr__(self):
        return '<Event %s>' % self.id


class ScheduledEvents(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    title = db.Column(db.String(32))
    location = db.Column(db.String(128))
    description = db.Column(db.String(256))
    date = db.Column(db.String(256))

    def __init__(self, user_id, title, location, description, date):
        self.user_id = user_id
        self.title = title
        self.location = location
        self.description = description
        self.date = date

    def __repr__(self):
        return '<ScheduledEvents %s>' % self.id


# create the dbs
with app.app_context():
    db.create_all()

'''http://flask.pocoo.org/docs/0.12/patterns/apierrors/'''


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


'''http://flask.pocoo.org/docs/0.12/patterns/apierrors/'''


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    response.message = error.message
    return response


def is_authenticated(user_id):
    return session and session['user_id'] == user_id


@app.route('/')
def index():
    """
    index() is the entry point our application. Connects to our index.html and
    renders our template. Don't change this function.

    :return: template of 'index.html'
    """
    resp = make_response(render_template('index.html'))
    resp.set_cookie('userid', value="wtf",
                    max_age=60 * 68 * 24 * 7,
                    secure=True,
                    httponly=True,
                    samesite='Lax')

    # secure: https only, httponly: cookies can't be read through javascript
    # samesite: how cookies are sent with requests from sites
    return resp


@app.route("/signup/", methods=['POST'])
def signup():
    if request.method == 'POST':
        password = request.json.get('password')
        form_user = request.json.get('username')
        if not password:
            raise InvalidUsage('The password is missing.', status_code=400)
        if not form_user:
            raise InvalidUsage('The username is missing', status_code=400)
        if not str(form_user).isalnum():
            raise InvalidUsage('The username is in an invalid format! Only alphanumeric characters!', status_code=401)
        exist_user = db.session.query(Users).filter_by(username=form_user).first()
        if exist_user is None:
            usr = Users(form_user, generate_password_hash(password))
            # db.session.query(Users).add(usr).commit()
            db.session.add(usr)
            db.session.commit()
            return json.dumps("{} signed up.".format(form_user))
        else:
            raise InvalidUsage(form_user + ' username already exist.', status_code=409)


@app.route("/signin/", methods=['POST'])
def signin():
    if request.method == 'POST':
        password = request.json.get('password')
        form_user = request.json.get('username')

        if not password:
            raise InvalidUsage('The password is missing.', status_code=400)
        if not form_user:
            raise InvalidUsage('The username is missing', status_code=400)

        usr = db.session.query(Users).filter_by(username=form_user).first()
        if usr is not None:
            if check_password_hash(usr.password, password):
                session['user_id'] = str(usr.id)
                return json.dumps(usr.id)
            else:
                raise InvalidUsage('Password is incorrect!', status_code=401)
        else:
            raise InvalidUsage('{} is not a valid user!'.format(form_user), status_code=401)


@app.route("/signout/", methods=['GET'])
def signout():
    if request.method == 'GET':
        # clear the sesssion
        session.pop('user_id', None)
        # set username cookie to blank
        return json.dumps("logout")


@app.route("/myevent/<user_id>/", methods=['GET', 'POST'])
def my_event(user_id):
    if request.method == 'POST':
        if not is_authenticated(user_id):
            raise InvalidUsage('Not Authorized', status_code=401)
        place_first = request.json.get('firstPlace')
        place_second = request.json.get('secondPlace')
        place_third = request.json.get('thirdPlace')
        if not user_id:
            raise InvalidUsage('User ID is missing', status_code=400)
        if not (place_first and place_second and place_third):
            raise InvalidUsage('A place is missing!', status_code=400)
        event = Events(user_id, place_first, place_second, place_third)
        db.session.add(event)
        db.session.commit()
        return json.dumps("hihihihihi")
    if request.method == 'GET':
        if not is_authenticated(user_id):
            raise InvalidUsage('Not Authorized', status_code=401)
        events = Events.query.all()
        event_list = []
        for event in events:
            if event.user_id == int(user_id):
                event_dict = {'id': event.id,
                              'userId': event.user_id,
                              'firstPlace': json.loads(event.place_first),
                              'secondPlace': json.loads(event.place_second),
                              'thirdPlace': json.loads(event.place_third)}
                event_list.append(event_dict)
        return json.dumps(event_list)


@app.route("/<user_id>/event/", methods=['GET', 'POST'])
def scheduled_event(user_id):
    if request.method == 'POST':
        if not is_authenticated(user_id):
            raise InvalidUsage('Not Authorized', status_code=401)
        title = request.json.get('title')
        location = request.json.get('location')
        description = request.json.get('description')
        date = request.json.get('date')
        event = ScheduledEvents(user_id, title, location, description, date)
        db.session.add(event)
        db.session.commit()
        return json.dumps("for wakanada")
    elif request.method == 'GET':
        if not is_authenticated(user_id):
            raise InvalidUsage('Not Authorized', status_code=401)
        scheduled_events = ScheduledEvents.query.filter(ScheduledEvents.user_id == user_id).order_by(
            desc(ScheduledEvents.date)).all()
        scheduled_events_list = []
        for event in scheduled_events:
            event_dict = {'id': event.id,
                          'userId': event.user_id,
                          'place': event.title,
                          'location': event.location,
                          'description': event.description,
                          'date': event.date}
            scheduled_events_list.append(event_dict)
        return json.dumps(scheduled_events_list)


@app.route("/event/<id>/", methods=['DELETE'])
def delete_scheduled_event(id):
    event = ScheduledEvents.query.filter(ScheduledEvents.id == id).first()
    if not event:
        raise InvalidUsage('Event does not exist', status_code=401)
    db.session.delete(event)
    db.session.commit()
    return json.dumps("DELETE SCHEDULED EVENT")


@app.route("/room/", methods=['GET', 'POST'])
def room():
    if request.method == 'POST':
        roomname = request.json.get('roomname')
        status = request.json.get('status')
        if not roomname:
            raise InvalidUsage('The roomname is missing', status_code=400)
        if not status:
            raise InvalidUsage('The status is missing', status_code=400)
        create_room = Room(roomname, status)
        db.session.add(create_room)
        db.session.commit()
        return json.dumps(create_room.id)
    if request.method == 'GET':
        # TODO: http://flask-sqlalchemy.pocoo.org/2.3/queries/
        return render_template('room.html')


@app.route("/room/<room_id>/user/", methods=['GET', 'POST'])
def temp_user(room_id):
    if request.method == 'GET':
        return json.dumps(_get_usernames_from_db(room_id))
    if request.method == 'POST':
        username = request.json.get('username')
        if not username:
            raise InvalidUsage('Username is missing', status_code=400)
        room = Room.query.filter(Room.id == room_id)
        if not room:
            raise InvalidUsage('The room does not exist!', status_code=401)
        room = room.filter(Room.status == "start").first()
        if not room:
            raise InvalidUsage('The room has already voted! Create or join another room!', status_code=401)
        temp_user = TempUsers(username, room_id, "start")
        db.session.add(temp_user)
        db.session.commit()
        return json.dumps(temp_user.id)


def _get_usernames_from_db(room_id):
    users = db.session.query(TempUsers).filter_by(room_id=room_id).all()
    if not users:
        raise InvalidUsage('Room {} does not exist.'.format(room_id), status_code=401)
    user_ids = []
    for user in users:
        user_ids.append(user.username)
    return user_ids


def _get_new_usernames(prev, curr):
    return list(filter(lambda username: username not in prev, curr))


@app.route("/room/<room_id>/suggestion/", methods=['GET', 'POST'])
def suggestion(room_id):
    if request.method == 'GET':
        suggestions_table = db.session.query(Suggestions).filter_by(room_id=room_id).all()
        suggestions = []
        for suggestion in suggestions_table:
            if suggestion.suggestion_json is None:
                suggestionobj = {'location': "",
                                 'id': room_id + suggestion.suggestion,
                                 'name': suggestion.suggestion
                                 }
            else:
                suggestionobj = json.loads(suggestion.suggestion_json)
            if suggestionobj not in suggestions:
                suggestions.append(suggestionobj)
        return json.dumps(suggestions)
    if request.method == 'POST':
        suggestion = request.json.get('suggestion')
        user_id = request.json.get('userId')
        suggestion_json = request.json.get('suggestionJson')
        if not user_id:
            raise InvalidUsage('user_id is missing', status_code=400)
        if not suggestion:
            raise InvalidUsage('suggestions is missing', status_code=400)

        suggestion_sess = db.session.query(Suggestions).filter_by(room_id=room_id).filter_by(
            suggestion=suggestion).first()
        if suggestion_sess is None:
            suggestion = Suggestions(room_id, suggestion.strip(), suggestion_json)
            print(suggestion.suggestion)
            db.session.add(suggestion)
            db.session.commit()

            return json.dumps("{}: new suggestion".format(suggestion))
        else:
            raise InvalidUsage('{} suggestion already exist.'.format(suggestion), status_code=409)


@app.route("/room/<room_id>/rank/", methods=['GET', 'POST'])
def rank(room_id):
    if request.method == 'GET':
        # TODO: implement
        return json.dumps("YEO SING NG WOW!!!")
    if request.method == 'POST':
        first = request.json.get('first')
        second = request.json.get('second')
        third = request.json.get('third')
        if not (first or second or third):
            raise InvalidUsage('ranking is missing', status_code=400)
        _add_rank_to_database(room_id, first, 5)
        _add_rank_to_database(room_id, second, 3)
        _add_rank_to_database(room_id, third, 1)
        return json.dumps("")


def _add_rank_to_database(room_id, suggestion, rank):
    rank = Rankings(room_id, suggestion, rank)
    db.session.add(rank)
    db.session.commit()


@app.route("/room/user/<user_id>/status/", methods=['PATCH'])
def user_status(user_id):
    if request.method == 'PATCH':
        status = request.json.get('status')
        if not status:
            raise InvalidUsage('Status is missing', status_code=400)
        usr = db.session.query(TempUsers).filter_by(id=user_id).first()
        if usr is None:
            raise InvalidUsage('User {} doesn\'t exist.'.format(user_id), status_code=401)
        usr.status = status
        db.session.commit()
        return json.dumps("{} changed the status".format(user_id))


@app.route("/room/<room_id>/status/", methods=['GET', 'PATCH'])
def room_status(room_id):
    if request.method == 'GET':
        room = db.session.query(Room).filter_by(room_id=room_id).first()
        if not room:
            raise InvalidUsage('Room {} does not exist.'.format(room_id), status_code=401)
        return json.dumps(room.status)
    if request.method == 'PATCH':
        status = request.json.get('status')
        if not status:
            raise InvalidUsage('Status is missing', status_code=400)

        room = db.session.query(Room).filter_by(id=room_id).first()
        if room is None:
            raise InvalidUsage('Room {} doesn\'t exist.'.format(room_id), status_code=401)
        room.status = status
        db.session.commit()
        return json.dumps("{} changed the status".format(room_id))


@app.route("/user/<user_id>/", methods=['GET'])
def get_username(user_id):
    user = Users.query.filter_by(id=user_id).first()
    if not user:
        raise InvalidUsage('{} doesn\'t exist.'.format(user_id), status_code=401)
    else:
        return json.dumps(user.username)


@app.route("/room/<room_id>/", methods=['GET'])
def get_room(room_id):
    room = Room.query.filter(Room.id == room_id).first()
    if not room:
        raise InvalidUsage('Oh! Are you sure you got your ID right?', status_code=401)
    return json.dumps(room.roomname)


@app.route("/room/<room_id>/submitted/", methods=['GET'])
def get_not_submitted(room_id):
    users = TempUsers.query.filter(TempUsers.room_id == room_id).filter(TempUsers.status != "done").all()
    users_name = []
    for user in users:
        users_name.append(user.username)
    return json.dumps(users_name)


@app.route("/room/search/<suggestion>/", methods=['GET'])
def get_suggestions(suggestion):
    # return search_places('Toronto', suggestion)
    return search_places(request.args.get('long'), request.args.get('lat'), suggestion)


@app.route("/room/<room_id>/winner/", methods=['GET'])
def get_winner(room_id):
    """
    1st place = 5 ranking
    2nd place = 3 ranking
    3rd place = 1 ranking

    :param room_id: room to get result for
    :return: list of top 3
    """
    rankings = db.session.query(Rankings).filter_by(room_id=room_id).all()
    ranking_dict = {}
    for ranking in rankings:
        ranking_dict[ranking.suggestion] = 0
    for ranking in rankings:
        ranking_dict[ranking.suggestion] += ranking.rank
    top_ranking = map(lambda rdict: rdict[0],
                      sorted(ranking_dict.items(),
                             key=operator.itemgetter(1),
                             reverse=True)[:3])
    place_obj = []
    for suggestion in top_ranking:
        place = Suggestions.query.filter(Suggestions.suggestion == suggestion).first()
        if place.suggestion_json is None:
            place_obj.append(json.dumps(suggestion))
        else:
            place_obj.append(place.suggestion_json)
    print(place_obj)
    return json.dumps(place_obj)


@app.route("/room/<user_id>/", methods=['DELETE'])
def delete_user(user_id):
    user = db.session.query(TempUsers).filter_by(id=user_id).first()
    if not user:
        raise InvalidUsage('User {} does not exist.'.format(user_id), status_code=401)
    db.session.delete(user)
    db.session.commit()
    return json.dumps("USER HAS BEEN DELETED!!!!~!!!!@!!@~!")


@app.route("/user/calendar/", methods=["GET", "OPTIONS"])
def calendar():
    return redirect(authorization_url)


@socketio.on('user change', namespace='/room')
def user_change(username):
    emit('user change', {'username': username}, broadcast=True)


@socketio.on("done suggesting", namespace="/room")
def done_ranking(username):
    emit('done suggesting', {'username': username}, broadcast=True)


@socketio.on("done ranking", namespace="/room")
def done_ranking(username):
    emit('done ranking', {'username': username}, broadcast=True)


@socketio.on("done room", namespace="/room")
def done_room():
    emit('done room', broadcast=True)


@socketio.on("new suggested event", namespace="/room")
def done_room():
    emit('new suggested event', broadcast=True)


if __name__ == '__main__':
    app=WhiteNoise(app)
    port = int(os.environ.get('PORT', 22940))
    socketio.run(app, debug=True, host='0.0.0.0', port=port)

    
