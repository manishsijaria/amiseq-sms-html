var getConnection = require('../../config/dbconnection')

module.exports.getcontactTypes = (callback) => {
    var getAllContactTypes = "SELECT * FROM contact_type"

    getConnection((err,connection)=> {
        connection.query(getAllContactTypes, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting ContactTypes list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }

        })
    })    
}