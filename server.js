//1. app dependencies

//npm modules
var express = require('express');
var path = require('path');
var logger = require('morgan');


//our own modules
var routes = require('./routes');


//2. db connection


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


//6. routes and request handlers
app.get('/', routes.index);

//7. app server start with host and port
app.listen(port, function() {
   console.log('the server is listening on port ', port);
});