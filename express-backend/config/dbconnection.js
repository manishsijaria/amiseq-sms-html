
var mysql = require('mysql')

var pool = mysql.createPool({
    host : (process.env.NODE_ENV === 'production') ? process.env.DB_HOST : process.env.DEMO_DB_HOST , 
    port : (process.env.NODE_ENV === 'production') ? process.env.DB_PORT : process.env.DEMO_DB_PORT, 
    user : (process.env.NODE_ENV === 'production') ? process.env.DB_USER : process.env.DEMO_DB_USER , 
    password : (process.env.NODE_ENV === 'production') ? process.env.DB_PASSWORD : process.env.DEMO_DB_PASSWORD , 
    database : (process.env.NODE_ENV === 'production') ? process.env.DB_DATABASE : process.env.DEMO_DB_DATABASE , 
    timezone: (process.env.NODE_ENV === 'production') ? process.env.DB_TIMEZONE : process.env.DEMO_DB_TIMEZONE  
}); 
//NOTE: you don't need to connect after getting the connection from the pool.
var getConnection = (callback) => {
    pool.getConnection((err, connection) => {
        callback(err,connection)
    })
}

module.exports = getConnection;