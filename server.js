//1. app dependencies: npm and our own modules
var express = require('express');


//2. db connection


//3. app instantiation
var app = express();


//4. app configuration (views, views engine, etc)
app.set('views', _dirname + '/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
var port = app.get('port');


//5. middleware definition (static, form handling, error handling, etc)
app.use(express.static(__dirname + '/public'));


//6. routes and request handlers


//7. app server start with host and port
app.listen(port, function() {
   console.log('the server is listening on port ', port);
});