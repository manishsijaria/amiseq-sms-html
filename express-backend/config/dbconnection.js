
var mysql = require('mysql')

var pool = mysql.createPool({
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : 'root',
    database : 'amiseq_sms_html',
    timezone: 'UTC+0'
}); 
//NOTE: you don't need to connect after getting the connection from the pool.
var getConnection = (callback) => {
    pool.getConnection((err, connection) => {
        callback(err,connection)
    })
}

module.exports = getConnection;