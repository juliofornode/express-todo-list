//1. app dependencies

//npm modules
var express = require('express');
var http = require('http');
//path.join normalizes the url (unix and window)
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoskin = require('mongoskin');
//method-override allows us to use http verbs with old browsers
var methodOverride = require('method-override');


//our own modules
var routes = require('./routes');
var tasks = require('./routes/tasks');


//2. db connection
var db = mongoskin.db('mongodb://localhost:27017/mytodo', {safe:true});


//3. app instantiation
var app = express();


//4. app configuration (views, views engine, etc)
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
var port = app.get('port');
app.set('x-powered-by', false);
app.locals.appname = 'myApp';


//5. middleware definition (static, form handling, error handling, etc)
app.use(express.static(path.join(__dirname + '/public')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(function(req, res, next) {
   req.db = {};
   req.db.tasks = db.collection('tasks');
   next();
});


//6. routes and request handlers
app.get('/', routes.index);
app.get('/tasks', tasks.list);


//7. app server start with host and port
http.createServer(app).listen(port, function() {
   console.log('the server is listening on port ', port);
});