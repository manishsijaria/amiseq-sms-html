var getConnection = require('../../config/dbconnection')

module.exports.addContact = (req, callback) => {
    //prepare insert query
    var insert_query = `INSERT INTO contact(firstname, lastname, mobile_no, contact_type_id, user_id) 
                        VALUES(?,?,?,?,?)`
    getConnection((err,connection)=> {
        const {firstname, lastname, mobile_no, contact_type_id, user_id} = req.body
        connection.query(insert_query,
            [firstname, lastname, mobile_no, contact_type_id, user_id],
            function(err,result) {
                connection.release()
                if(err) {
                    callback(null,err)
                    console.log('error in inserting contact' + err);                                
                } else {
                    //NOTE: The response must be a JSON string, so that it is caught on the react-client properly.
                    //      Otherwise Err: net::ERR_EMPTY_RESPONSE TypeError: Failed to fetch  occures.
                    var success_msg = 'Insert Successful id=' + result.insertId;
                    console.log('insert successful : ' + success_msg);
                    callback({ contact_id: result.insertId, firstname, lastname, mobile_no, contact_type_id, user_id },null)
                }
            })
    })     
}

module.exports.getContacts = (user_id, callback) => {
    var queryContacts = `SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
                                mobile_no, contact_type_id, user_id, msg_count FROM 
                            contact WHERE user_id=` + user_id + ` ORDER BY msg_count desc, fullname asc`
 

    getConnection((err,connection)=> {
        connection.query(queryContacts, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Contacts list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })    
}