//1. app dependencies

//npm modules
var express = require('express');
//path.join normalizes the url (unix and window)
var path = require('path');
var logger = require('morgan');
var mongoskin = require('mongoskin');
//method-override allows us to use http verbs with old browsers
var methodOverride = require('method-override');


//our own modules
var routes = require('./routes');


//2. db connection
var db = mongoskin.db('mongodb://localhost:27017/mytodo?auto_reconnect', {safe:true});


//3. app instantiation
var app = express();


//4. app configuration (views, views engine, etc)
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
var port = app.get('port');
app.set('x-powered-by', false);


//5. middleware definition (static, form handling, error handling, etc)
app.use(express.static(path.join(__dirname + '/public')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(function(req, res, next) {
   req.db = {};
   req.db.tasks = db.collection('tasks');
   next();
});


//6. routes and request handlers
app.get('/', routes.index);


//7. app server start with host and port
app.listen(port, function() {
   console.log('the server is listening on port ', port);
});