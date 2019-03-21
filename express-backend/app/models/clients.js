
var getConnection = require('../../config/dbconnection')
var modelsUtils = require('./modelsUtils')
var CONSTANTS = require('../../config/constants')
const client_sql_queries = {
    CLIENTS_ID : `SELECT client_id from client ORDER BY client_id`,
    CLIENTS_MSGS: `SELECT msg_id, msg_from from client_msg WHERE ? ORDER BY msg_id desc`
}

module.exports.addClient = (req, callback) => {
    //prepare insert query
    var insert_query = `INSERT INTO client(company_name, contact_person_name, mobile_no,
                                    phone1,phone2,email,address1,address2,country,
                                    state,city,zip) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`
    getConnection((err,connection)=> {
        const {company_name, contact_person_name, mobile_no,
                phone1,phone2,email,address1,address2,country,
                state,city,zip} = req.body
        connection.query(insert_query,
            [company_name, contact_person_name, mobile_no,
            phone1,phone2,email,address1,address2,country,
            state,city,zip],
            function(err,result) {
                connection.release()
                if(err) {
                    callback(null,err)
                    console.log('error in inserting user' + err);                                
                } else {
                    //NOTE: The response must be a JSON string, so that it is caught on the react-client properly.
                    //      Otherwise Err: net::ERR_EMPTY_RESPONSE TypeError: Failed to fetch  occures.
                    var success_msg = 'Insert Successful id=' + result.insertId;
                    console.log('insert successful : ' + success_msg);
                    callback({ client_id: result.insertId, company_name: company_name, contact_person_name: contact_person_name, mobile_no: mobile_no,
                                phone1 : phone1,phone2 : phone2,email : email ,address1: address1, address2: address2,country: country,
                                state: state,city: city,zip: zip },null)
                }
            })
    })     
}

module.exports.editClient = (number , req,  callback) => {
    var update_query = `UPDATE client SET ? WHERE ?`
    condition = {client_id: number}
    console.log(JSON.stringify(condition))
    getConnection((err,connection)=> {
        const {company_name, contact_person_name, mobile_no,
                phone1,phone2,email,address1,address2,country,
                state,city,zip} = req.body
        connection.query(update_query, [req.body, condition], 
            function(err,result)  {
                connection.release()
                if(err) {
                    callback(null,err)
                    console.log('error in update ' + err)
                } else {
                    var success_msg = 'Update Successful id=' + condition.client_id
                    console.log(success_msg)
                    callback({client_id: condition.client_id, company_name: company_name, contact_person_name: contact_person_name, mobile_no: mobile_no,
                        phone1 : phone1,phone2 : phone2,email : email ,address1: address1, address2: address2,country: country,
                        state: state,city: city,zip: zip }, null)
                }
            })
    })
}

module.exports.getClients = (callback) => {
    var getAllClients = "SELECT * FROM client"

    getConnection((err,connection)=> {
        connection.query(getAllClients, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Clients list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }

        })
    })    
}

module.exports.deleteClients = (clientArray , callback) => {
    var deleteClients = `DELETE FROM client WHERE client.client_id IN (` + clientArray.join(',') + `)`
    getConnection((err,connection)=> {
        connection.query(deleteClients, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in deleting Clients')
            } else {
                callback(result,null)
                console.log('result.length=' + JSON.stringify(result.length))
                console.log('result=' + JSON.stringify(result))
            }

        })
    })    
}

module.exports.smsAll = (param, smsText, callback) => {
    switch (param) {
        case 'WITHOUT_ASSOC_CANDIDATES':
            console.log('models - WITHOUT_ASSOC_CANDIDATES')

            //get the list of all clients with their ID's
            this.getClients((result,err)=> {
                if(err) { console.log(err) }
                else {
                    let clientList = JSON.parse(JSON.stringify(result))
                    //get the connection
                    getConnection((err,connection)=> { 
                        modelsUtils.sendMsgToClients(smsText, clientList, connection)
                        connection.release()
                    }) //end getConnection
                } //end if
            }) // end getClients
            callback({msg: 'success'}, null)
            break;
        case 'WITH_ASSOC_CANDIDATES':
            console.log('models - WITH_ASSOC_CANDIDATES')
            /* Left Join :  All the rows of first table client, 
                            with non null values for second table(which matches the condition)*/
            const left_join_query = `select client.client_id,client.company_name, client.mobile_no, candidate.candidate_id, candidate.mobile_no as candidate_mob_no
                                        from client 
                                        left join candidate on client.client_id=candidate.client_id`
            //get the connection
            getConnection((err,connection)=> { 
                //execute the left join query.
                connection.query(left_join_query,[],(err, result) => {
                    if(err) { console.log(err) }
                    else {
                        //For each row 
                        let left_join_rows = JSON.parse(JSON.stringify(result))
                        modelsUtils.sendMsgToClientsAndCandidates(smsText, left_join_rows,connection)
                    }
                })
                connection.release()
            })
            callback({msg: 'success'}, null)
            break;
    }
}


//Note: clientArray contains only the client_id's of client table.
module.exports.smsChecked = (param, smsText, clientArray, callback) => {
    switch (param) {
        case 'WITHOUT_ASSOC_CANDIDATES':
            console.log('models - WITHOUT_ASSOC_CANDIDATES')
            let select_without_assoc_candidate_query = `SELECT client_id, mobile_no from client `
            select_without_assoc_candidate_query = select_without_assoc_candidate_query + `WHERE client_id IN(` + clientArray.join(',') + `)`
            console.log(select_without_assoc_candidate_query)
            //get the connection
            getConnection((err,connection)=> { 
                //get the mobile no's for the client_id in clientArray.
                connection.query(select_without_assoc_candidate_query,[],(err,result) => {
                    if(err) { console.log(err) }
                    else {
                        //got the result of select
                        let clientList = JSON.parse(JSON.stringify(result))
                        //call the function to send message to client.
                        modelsUtils.sendMsgToClients(smsText, clientList, connection)
                    }
                })
                connection.release()
            })
            callback({msg: 'success'}, null)
            break;
        case 'WITH_ASSOC_CANDIDATES':
            console.log('models - WITH_ASSOC_CANDIDATES')
            let select_with_assoc_candidate_query = `select client.client_id,client.company_name, client.mobile_no, 
                                                            candidate.candidate_id, candidate.mobile_no as candidate_mob_no
                                                    from client 
                                                    left join candidate on client.client_id=candidate.client_id `
            select_with_assoc_candidate_query = select_with_assoc_candidate_query + `WHERE client.client_id IN(` + clientArray.join(',') + `)`
            console.log(select_with_assoc_candidate_query)

            //get the connection
            getConnection((err,connection)=> { 
                //get the mobile no's for the client_id in clientArray.
                connection.query(select_with_assoc_candidate_query,[],(err,result) => {
                    if(err) { console.log(err) }
                    else {
                        //got the result of select
                        let clientAndCandidateList = JSON.parse(JSON.stringify(result))
                        //call the function to send message to client.
                        modelsUtils.sendMsgToClientsAndCandidates(smsText, clientAndCandidateList, connection)
                    }
                })
                connection.release()
            })            
            callback({msg: 'success'}, null)
            break;
    }
}

module.exports.getClientMsgs = (client_id, fetchText, callback) => {
    var queryClientMsgs = `SELECT DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date , msg_from, msg_to, sms_text 
                            FROM 
                            client_msg WHERE client_id=` + client_id 
    let whereDateCondition = ''
    switch (fetchText) {
        case 'ALL':
            break;
        case '1_YEAR':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 365 DAY)`
            break;
        case '6_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 180 DAY)`
            break;
        case '3_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 90 DAY)`
            break;
        case '1_MONTH':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 30 DAY)`
            break;
        case '15_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 15 DAY)`
            break;
        case '7_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 7 DAY)`
            break;
    }
    var caluseOrderBy =  ` ORDER BY msg_date asc`
    if(whereDateCondition !== '') {
        queryClientMsgs = queryClientMsgs + ` AND ` + whereDateCondition + caluseOrderBy
    } else {
        queryClientMsgs = queryClientMsgs + caluseOrderBy
    }

    getConnection((err,connection)=> {
        connection.query(queryClientMsgs, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Clients Msgs list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })    
}

module.exports.getClientMsgsCount = (client_id,fetchText, callback) => {
   var queryClientMsgsCount = `SELECT count(*) as msgsCount 
                            FROM 
                            client_msg WHERE client_id=` + client_id 
    //console.log('fetchText=' + fetchText)
    let whereDateCondition = ''
    switch (fetchText) {
        case 'ALL':
            break;
        case '1_YEAR':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 365 DAY)`
            break;
        case '6_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 180 DAY)`
            break;
        case '3_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 90 DAY)`
            break;
        case '1_MONTH':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 30 DAY)`
            break;
        case '15_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 15 DAY)`
            break;
        case '7_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 7 DAY)`
            break;
       
    }
    if(whereDateCondition !== '') {
        queryClientMsgsCount = queryClientMsgsCount + ` AND ` + whereDateCondition
    }
    console.log('queryClientMsgsCount=' + queryClientMsgsCount)
    getConnection((err,connection)=> {
        connection.query(queryClientMsgsCount, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Clients Msgs Count')
            } else {
                callback(result[0].msgsCount,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })        
}

module.exports.clients_msg_count_array = (cb) => {
    var arr_clients_msg_count = []
    getConnection((err,connection)=> { 
        connection.query(client_sql_queries.CLIENTS_ID,[],(err,result) => {
            if(!err) {
                if(result.length) {
                    console.log("result.length=" + result.length)
                    for(let i=0; i < result.length; i++) {
                        condition = {client_id: result[i].client_id}
                        connection.query(client_sql_queries.CLIENTS_MSGS,[condition], 
                            function(err,result_inner)  {
                             if(!err) {
                                 let count = 0
                                 if(result_inner.length) {
                                    for(let j=0; j< result_inner.length; j++) {
                                        if(result_inner[j].msg_from !== CONSTANTS.TWILIO_AMISEQ_NO) {
                                            count++
                                        } else {
                                            break  //exit the for loop, no message at the top
                                        }
                                    }
                                 }
                                 arr_clients_msg_count.push({client_id: result[i].client_id, msg_count: count })
                                 if(i=== result.length -1) { //fix for closers
                                    connection.release();
                                    cb(arr_clients_msg_count)                
                                 }
                             }   
                        })
                    }
                }
            }
        })
    })   
}