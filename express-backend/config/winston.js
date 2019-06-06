
//a package that is useful when specifying paths in Node.js. 
//This package is not directly related to Winston, but helps immensely 
//when specifying paths to files in Node.js code. 
var appRoot = require('app-root-path');

//logging library
//var winston = require('winston');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
/*
Winston uses npm logging levels that are prioritized from "0" to 5 ("highest" to lowest):
const levels = { 
  error: 0, 
  warn: 1, 
  info: 2, 
  verbose: 3, 
  debug: 4, 
  silly: 5 
};

Winston comes with three core transports - console, file, and HTTP. 
*/


var options = {
    fileDailyRotateFile : {
      filename: `${appRoot}/logs/app-%DATE%.log`, //This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename.
      datePattern: 'YYYY-MM-DD',  //default 'YYYY-MM-DD')
      zippedArchive: true,        //A boolean to define whether or not to gzip archived log files (default 'false').
      maxSize: 20 * 1024 * 1024,  // 20MB, //Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix.
      maxFiles: '14d',            //Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix.     
      json: true,
    },
    /*
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    */
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
    format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        //format.json(),
        format.simple(),
      ),

    transports: [
      //new transports.File(options.file),
      new transports.DailyRotateFile(options.fileDailyRotateFile),
      new transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
  
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};
  
module.exports = logger;