var getConnection = require('../../config/dbconnection')
var winston = require('../../config/winston');

module.exports.getUserTypes = (callback) => {
    var getAllUserTypes = "SELECT * FROM user_type"

    getConnection((err,connection)=> {
        connection.query(getAllUserTypes, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting UserTypes list')
            } else {
                callback(result,null)
                winston.log('info', result.length)
                winston.log('info',result)
            }

        })
    })    
}