var getConnection = require('../../config/dbconnection')
var winston = require('../../config/winston');


module.exports.getContactsFilter = (filterText) => {
    let condition = ''
    if(filterText) {
        condition = ` CONCAT(contact.firstname,' ', contact.lastname) like '%` + filterText + `%'`
        condition += ` OR contact.mobile_no like '%` + filterText + `%'`
    }
    return condition;
}

module.exports.getContacts = (offset, count, filterText, callback) => {
   var selectClause = `SELECT contact_id, contact.firstname as firstname, contact.lastname as lastname,
                                CONCAT(contact.firstname,' ', contact.lastname) as fullname,
                                contact.mobile_no, contact_type_id, contact.user_id, msg_count, msg_date, NOW() as todays_date, 
                                contact.date_created, DATE_FORMAT(contact.date_created, "%m/%d/%Y")  as contact_create_date,
                                CONCAT(user.firstname, ' ', user.lastname) as added_by_username
                        FROM  contact 
                        left outer join user on contact.user_id=user.user_id `

    var whereCondition1 = this.getContactsFilter(filterText)
    var whereClause = ''
    if(whereCondition1) {
        whereClause = ` WHERE ` + whereCondition1
    }

    var  orderByClause = ` ORDER BY msg_date desc, msg_count desc, contact.date_created desc, fullname asc LIMIT ` + offset + `,` + count
    var queryContacts = selectClause + whereClause + orderByClause

    getConnection((err,connection)=> {
        connection.query(queryContacts, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting Contacts list Error:' + err)
                winston.log('error','Query:' + queryContacts)
            } else {
                callback(result,null)
                winston.log('info','========================= getContacts query =========================')
                winston.log('info',queryContacts)
                //winston.log("info", result )
                //console.log(JSON.stringify(result.length))
                winston.log('info',JSON.stringify(result))
                winston.log('info','=====================================================================')
            }
        })
    })    
}

module.exports.addContact = (req, callback) => {
    var  that = this //NOTE: this is not accessible in callback functions.
    //prepare insert query
    var insert_query = `INSERT INTO contact(firstname, lastname, mobile_no, contact_type_id, user_id) 
                        VALUES(?,?,?,?,?)`
    const {firstname, lastname, mobile_no, contact_type_id, user_id} = req.body
    getConnection((err,connection)=> {
        
        connection.query(insert_query,
            [firstname, lastname, mobile_no, contact_type_id, user_id],
            function(err,result) {
                connection.release()
                if(err) {
                    callback(null,err)
                    winston.log('error','error in inserting contact' + err);                                
                } else {
                    //NOTE: The response must be a JSON string, so that it is caught on the react-client properly.
                    //      Otherwise Err: net::ERR_EMPTY_RESPONSE TypeError: Failed to fetch  occures.
                    var success_msg = 'Insert Successful id=' + result.insertId;
                    winston.log('info','insert successful : ' + success_msg);
                    winston.log('info','user_id  : ' + user_id);
                    that.getContacts(0,1,mobile_no, (resultInner,error) => {
                        if(error) { 
                            return  callback(null,error) 
                        }
                        else { 
                            winston.log('info','========resultInner[0]=====' + resultInner[0]);
                            return callback(resultInner[0],null) 
                        }        
                    })         
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
                winston.log('error','Error in deleting Contact')
            } else {
                winston.log('info','result.length=' + JSON.stringify(result.length))
                winston.log('info','result=' + JSON.stringify(result))
                callback(result,null)
            }

        })
    })    
}





module.exports.getContactsCount = (filterText, callback) => {
    var selectClause = `SELECT count(*) as count 
                            FROM 
                            contact`
    //var whereClause = (filterText) ? ` WHERE CONCAT(firstname,' ', lastname) like '%` + filterText + `%'` : ``
    var whereClause = this.getContactsFilter(filterText)
    if(whereClause) {
        whereClause = ` WHERE ` + whereClause
    }
    var queryContactsCount = selectClause + whereClause
    winston.log('info', queryContactsCount)
    getConnection((err,connection)=> {
        connection.query(queryContactsCount, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting contact count')
            } else {
                callback(result[0].count, null)
                winston.log('info',result.length)
                winston.log('info', result)
            }
        })
    })
}

module.exports.getMsgsCount = (contact_id, callback) => {
    let queryContactMsgsCount = this.getContactMsgsQuery(-1,-1,contact_id)
    let fullQuery = ` SELECT count(*) as msgsCount FROM (` + queryContactMsgsCount + `) X`
    //console.log('queryContactMsgsCount=' + fullQuery)
    getConnection((err,connection)=> {
        connection.query(fullQuery, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting Contacts Msgs Count')
            } else {
                callback(result[0].msgsCount,null)
                winston.log('info',result.length)
                winston.log('info',result)
            }
        })
    })         
}

// private function
module.exports.getContactMsgsQuery = (offset,count, contact_id) => {
    //DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date
    let leftJoin = `SELECT message_id,msg_date, DATE_FORMAT(msg_date, "%m/%d/%Y %l:%i %p") as message_date, 
                                msg_from, msg_to, sms_text, contact_id, 
                                message.user_id,  CONCAT(user.firstname,' ', user.lastname) as fullname   
                        FROM message left outer join user on message.user_id=user.user_id 
                                                             where message.contact_id=` + contact_id
    let rightJoin = `SELECT message_id, msg_date, DATE_FORMAT(msg_date, "%m/%d/%Y %l:%i %p") as message_date, 
                            msg_from, msg_to, sms_text, contact_id, 
                            message.user_id, CONCAT(user.firstname,' ', user.lastname) as fullname    
                    FROM message right outer join user on message.user_id=user.user_id 
                                                          where message.contact_id=` + contact_id +
                                                          ` and message.user_id is null`
                           
    let orderByClause = `  ORDER BY msg_date asc ` 
    let limitClause = ``
    if(offset !== -1 && count !== -1) {
        limitClause = ` LIMIT ` + offset + `,` + count
    }
    let queryContactMsgs = leftJoin + ` UNION ALL ` + rightJoin + orderByClause + limitClause
    return queryContactMsgs;
}

module.exports.getContactMsgs = (offset, count, contact_id, callback) => {
    let queryContactMsgs = this.getContactMsgsQuery(offset,count,contact_id)

    getConnection((err,connection)=> {
        connection.query(queryContactMsgs, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error in getting contact Msgs list')
                winston.log('info','Query:' + queryContactMsgs)
            } else {
                callback(result,null)
                //console.log('========================= getContactMsgs query =========================')
                //console.log(queryContactMsgs)
                //console.log('========================================================================')
                winston.log('info',"offset: " + offset + ", count:" + count)
                //console.log(JSON.stringify(result.length))
                //console.log(JSON.stringify(result))
            }
        })
    })
}
