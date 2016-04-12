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
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var lessMiddleware = require('less-middleware');


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
app.locals.moment = require('moment');


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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('CEAF3FA4-F385-49AA-8FE4-54766A9874F1'));
app.use(session({
   secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9',
   resave: true,
   saveUninitialized: true
}));
app.use(csrf());
app.use(function(req, res, next) {
   res.locals._csrf = req.csrfToken();
   return next();
});
app.use(lessMiddleware(path.join(__dirname + '/public')));

// development only
if ('development' == app.get('env')) {
   app.use(errorHandler());
}



//6. routes and request handlers
app.param('task_id', function(req, res, next, taskId) {
   req.db.tasks.findById(taskId, function(error, task){
      if (error) return next(error);
      if (!task) return next(new Error('Task is not found.'));
      req.task = task;
      return next();
   });
});

app.get('/', routes.index);
app.get('/tasks', tasks.list);
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markCompleted);
app.post('/tasks', tasks.markAllCompleted);
app.delete('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);


//catch-all route
app.all('*', function(req, res){
   res.status(404).send();
});



//7. app server start with host and port
http.createServer(app).listen(port, function() {
   console.log('the server is listening on port ', port);
});