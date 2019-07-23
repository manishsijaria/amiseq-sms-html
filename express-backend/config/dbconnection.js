
var mysql = require('mysql')

var pool = mysql.createPool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER ,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    timezone: process.env.DB_TIMEZONE
}); 
//NOTE: you don't need to connect after getting the connection from the pool.
var getConnection = (callback) => {
    pool.getConnection((err, connection) => {
        callback(err,connection)
    })
}

module.exports = getConnection;