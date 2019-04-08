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

module.exports.deleteContact = (contact_id , callback) => {
    var deleteContact = `DELETE FROM contact WHERE contact_id =` + contact_id
    getConnection((err,connection)=> {
        connection.query(deleteContact, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in deleting Contact')
            } else {
                console.log('result.length=' + JSON.stringify(result.length))
                console.log('result=' + JSON.stringify(result))
                callback(result,null)
            }

        })
    })    
}

module.exports.getContacts = (offset, count, filterText, callback) => {
    var selectClause = `SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
                                mobile_no, contact_type_id, user_id, msg_count FROM 
                            contact`  
    var whereClause = (filterText) ? ` WHERE CONCAT(firstname,' ', lastname) like '%` + filterText + `%'` : ``
    var  orderByClause = ` ORDER BY msg_count desc, contact_id asc, fullname asc LIMIT ` + offset + `,` + count
    var queryContacts = selectClause + whereClause + orderByClause

    getConnection((err,connection)=> {
        connection.query(queryContacts, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Contacts list Error:' + err)
                console.log('Query:' + queryContacts)
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })    
}

module.exports.getContactsCount = (filterText, callback) => {
    var selectClause = `SELECT count(*) as count 
                            FROM 
                            contact`
    var whereClause = (filterText) ? ` WHERE CONCAT(firstname,' ', lastname) like '%` + filterText + `%'` : ``
    var queryContactsCount = selectClause + whereClause
    console.log(queryContactsCount)
    getConnection((err,connection)=> {
        connection.query(queryContactsCount, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting contact count')
            } else {
                callback(result[0].count, null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })
}