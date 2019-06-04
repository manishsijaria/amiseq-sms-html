
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var winston = require('./config/winston');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var CONSTANTS = require('./config/constants')

//var index = require('./routes/index');
//var users = require('./routes/users');
var app = express();

var controller_router = require('./app/controllers/index');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*
NOTE: The first place we'll actually use winston is with morgan. We will use the stream option,
and set it to the stream interface we created as part of the winston configuration.
*/
//short or combined
app.use(morgan('short', { 'stream': winston.stream }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
app.use(controller_router);
//=============== www ========================
var debug = require('debug')('express-backend:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || CONSTANTS.SERVER_PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

server.on('error', onError);
server.on('listening', onListening);
//============= socket.io ========================
var io = require('socket.io').listen(server)

//https://stackoverflow.com/questions/20144414/socket-io-connection-to-server-doesnt-work-sometimes
//io.set('transports', ['xhr-polling']);

//KB: set the io in app, so that it can be retrived from routes req object later.
app.set('socketio', io)

//============================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/*
err.status - The HTTP error status code. If one is not already present, default to 500.
err.message - Details of the error.
req.originalUrl - The URL that was requested.
req.path - The path part of the request URL.
req.method - HTTP method of the request (GET, POST, PUT, etc.).
req.ip - Remote IP address of the request.
*/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  winston.log("info", "Amiseq SMS App listening on:" + bind);

  debug('Listening on ' + bind);
}

module.exports = app;
