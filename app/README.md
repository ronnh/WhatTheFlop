# HOW2INSTALL

## SUMMARY/TLDR; :
Execute these two scripts in different tabs for quick and dirty setup and to run app:

- In main directory:
``` 
pip install flask
pip install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

- In static:
```
npm install -g webpack
npm install
webpack --watch
```

`python app.py` and `webpack --watch` runs the server and re-compiles your JavaScript code when changes are made.

To edit the frontend and backend, edit `static/js/app.js` and `app.py` respectively.


## PRE-REQUISITES:
Make sure you have `pip`, `npm` installed and `node` updated if you installed it with brew.


## SETUP:
#### BACKEND
###### FLASK
1. Install Flask if you don't have it:
``` 
pip install flask
```
2. Install virtualenv if you don't have it:
```
pip install virtualenv
```

3. Create a virtualenv and activate it
```
virtualenv venv
source venv/bin/activate
```

4. Install all dependencies from requirements.txt
```
pip install -r requirements.txt
```

###### DB
We're going to be using Postgres. We need to setup our own DB on our own machines. This part is a little fickle and annoying since Flask needs a map in order to create a relational database. We are going to use Flask-SQLAlchemy which is installed with STEP 4 above.

1. Install Postgres with Homebrew:
```
brew install postgresql -v
```

2. Initialize DB in our Postgres directory. For windows, this should be in Program Files somewhere...
```
initdb /usr/local/var/postgres
```

3. Start our server:
```
postgres -D /usr/local/var/postgres
```

4. Now we want to create our database. This is done by opening PostgreSQL in Terminal or by Application. For Terminal, this can be done with the following command:
```
$ psql db
```

5. Now create an admin account that will be in charge of the database. In terminal we can do this with the following command:
```
CREATE USER admin WITH SUPERUSER PASSWORD 'mypassword';
```

6. Now create the database
```
CREATE DATABASE db;
```

7. Now put the following in the app.py
```
with app.app_context():
    db.create_all()
```

#### FRONTEND
1. Install webpack if you don't have it. Webpack helps us manage our dependencies, and changes our code depending on the browser. Works very well with React.
```
npm install -g webpack
```

2. Install the rest of the dependencies
```
npm install
```

## DEV:
#### BACKEND
Edit `app.py`, which acts as our main python server.

#### FRONTEND
The entry point is `static/js/index.js`. We however want to edit `static/js/app.js` as it is our React component. `webpack --watch` re-compiles our JavaScript code whenever changes are made.

## RUN:
```
source venv/bin/activate
python app.py
```
This activates our virtualenv and runs our server.

## MORE INFO:
https://github.com/angineering/FullStackTemplate