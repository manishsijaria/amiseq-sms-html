var getConnection = require('../../config/dbconnection')
var winston = require('../../config/winston');

module.exports.getcontactTypes = (callback) => {
    var getAllContactTypes = "SELECT * FROM contact_type"

    getConnection((err,connection)=> {
        connection.query(getAllContactTypes, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting ContactTypes list')
            } else {
                callback(result,null)
                winston.log('info', result.length)
                winston.log('info',result)
            }

        })
    })    
}