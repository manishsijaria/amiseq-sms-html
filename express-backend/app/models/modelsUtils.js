var CONSTANTS = require('../../config/constants')
var twilio = require('twilio')
var fs = require('fs');
const path = require('path')


const utils_sql_queries = {
    INSERT_MESSAGE: `INSERT INTO message(msg_from,msg_to,sms_text,contact_id,user_id) VALUES(?,?,?,?,?)`,
}

module.exports.sendMsgToContacts = (user_id, smsText, contactList, connection,io) => {
    var twilioClient = new twilio(CONSTANTS.TWILIO_SID, CONSTANTS.TWILIO_TOKEN)                            
    //for each client 
    let arrayLength = contactList.length
    for(let i=0; i < arrayLength; i++) {
        //get the mobile no, and send message, smsText
        twilioClient.messages.create({to: contactList[i].mobile_no,
                            from: CONSTANTS.TWILIO_AMISEQ_NO,
                            body: smsText},
        (err, messageData) => {
            if(err) {
                //log err msg in client_msg table.
                //err.code === 'ETIMEDOUT' internet connection failed on 
                //                         SMS application hosting network
                //                         don't log this message.
                /*
                if(err.code !== 'ETIMEDOUT') {
                    
                    this.insertToMessage(connection,  
                                        CONSTANTS.TWILIO_AMISEQ_NO, 
                                        contactList[i].mobile_no, 
                                        err.message,
                                        contactList[i].contact_id,
                                        user_id 
                                        )
                }
                */
                console.log('============ Error  in sending message from Server to twilio =========')
                console.log(err)
                console.log('=======================================================================')
            } else {
                this.insertToMessage(connection, 
                                     CONSTANTS.TWILIO_AMISEQ_NO, 
                                     contactList[i].mobile_no, 
                                     smsText,
                                     contactList[i].contact_id,
                                     user_id 
                                     )
                // print SID of the message you just sent
                console.log(messageData.sid);
                this.sendAndReceiveNotification(io, contactList[i].contact_id)
                
            }
        })  
    }
}

module.exports.sendAndReceiveNotification = (io, contact_id) => {
    let sendAndReceiveNSP= io.of('/sendAndReceive');
    console.log('=====sending incrementMsgsCount to sockets ========')
    sendAndReceiveNSP.emit('incrementMsgsCount', {contact_id: contact_id, by: 1}); 
}

module.exports.insertToMessage = (connection, from, to, text, contact_id, user_id) => {
    connection.query(utils_sql_queries.INSERT_MESSAGE,
        [from, to, text ,contact_id, user_id ],
        function(err,result) {
                if(err) {  console.log(err)  }
        })   
}

//##################### Delete Below Code ####################

const sql_queries = {
    INSERT_CLIENT: `INSERT INTO client_msg(msg_from,msg_to,sms_text,client_id) VALUES(?,?,?,?)`,
    INSERT_CANDIDATE: `INSERT INTO candidate_msg(msg_from,msg_to,sms_text,candidate_id) VALUES(?,?,?,?)`,
    SELECT_CANDIDATE_RESUME_FILENAME: `SELECT resume_filename from candidate WHERE candidate.candidate_id IN `,
}

/*
params:
clientList : array containg mobile_no and client_id
*/
module.exports.sendMsgToClients = (smsText, clientList, connection) => {
    //var insert_client_msg = `INSERT INTO client_msg(sms_text,client_id) VALUES(?,?)`
    var twilioClient = new twilio(CONSTANTS.TWILIO_SID, CONSTANTS.TWILIO_TOKEN)                            
    //for each client 
    let arrayLength = clientList.length
    for(let i=0; i < arrayLength; i++) {
        //get the mobile no, and send message, smsText
        twilioClient.messages.create({to: clientList[i].mobile_no,
                            from: CONSTANTS.TWILIO_AMISEQ_NO,
                            body: smsText},
        (err, messageData) => {
            if(err) {
                //log err msg in client_msg table.
                this.insertToClientMsg(connection, CONSTANTS.TWILIO_AMISEQ_NO, clientList[i].mobile_no, err.message,clientList[i].client_id )
                console.log(err)
            } else {
                this.insertToClientMsg(connection,CONSTANTS.TWILIO_AMISEQ_NO, clientList[i].mobile_no, smsText,clientList[i].client_id )
                //log smsText in client_msg table.

                // print SID of the message you just sent
                console.log(messageData.sid);
            }
        })  
    }
}

module.exports.insertToClientMsg = (connection, from, to, text, client_id) => {
    connection.query(sql_queries.INSERT_CLIENT,
        [from, to, text ,client_id ],
        function(err,result) {
                if(err) {  console.log(err)  }
        })   
}

/*
params:
clientAndCandidateList: array of objects containing 
                        client_id, mobile_no, candidate_mob_no, candidate_id
*/
module.exports.sendMsgToClientsAndCandidates = (smsText, clientAndCandidateList,connection) => {
    var twilioClient = new twilio(CONSTANTS.TWILIO_SID, CONSTANTS.TWILIO_TOKEN) 
    let clientAndCandidateListCount = clientAndCandidateList.length
    console.log('clientAndCandidateListCount=' +clientAndCandidateListCount)
    
    //NOTE: left join have duplicate of clients id's, if candidate is multiple for a client.
    let duplicate_clients = []  
    for(let i=0; i < clientAndCandidateListCount; i++) {
        //with client_id send the message to client.
        if(duplicate_clients.indexOf(clientAndCandidateList[i].client_id) === -1) {
            twilioClient.messages.create({to: clientAndCandidateList[i].mobile_no,
                from: CONSTANTS.TWILIO_AMISEQ_NO,
                body: smsText},
                (err, messageData) => {
                    if(err) {
                        //log err msg in client_msg table.
                        this.insertToClientMsg(connection,CONSTANTS.TWILIO_AMISEQ_NO,clientAndCandidateList[i].mobile_no, err.message,clientAndCandidateList[i].client_id )

                        console.log(err)
                    } else {
                        //log smsText in client_msg table.
                        this.insertToClientMsg(connection, CONSTANTS.TWILIO_AMISEQ_NO,clientAndCandidateList[i].mobile_no, smsText,clientAndCandidateList[i].client_id )

                        // print SID of the message you just sent
                        console.log(messageData.sid);
                    }
            })            
            duplicate_clients.push(clientAndCandidateList[i].client_id)
        }
        
        //if candidate_id is not null send the message to candidate.
        if(clientAndCandidateList[i].candidate_id) {
            this.sendMsgToCandidate(twilioClient,connection, smsText,
                                    clientAndCandidateList[i].candidate_id,
                                    clientAndCandidateList[i].candidate_mob_no)
        }                         
    }
}

//Private to this module, do not use from outside.
module.exports.sendMsgToCandidate = (twilioClient, connection, smsText, 
                                     candidate_id, candidate_mob_no) => {
    twilioClient.messages.create({to: candidate_mob_no,
        from: CONSTANTS.TWILIO_AMISEQ_NO,
        body: smsText},
        (err, messageData) => {
            if(err) {
                //log err msg in client_msg table.
                this.insertToCandidateMsg(connection,CONSTANTS.TWILIO_AMISEQ_NO,candidate_mob_no, err.message, candidate_id)

                console.log(err)
            } else {
                //log smsText in client_msg table.
                this.insertToCandidateMsg(connection,CONSTANTS.TWILIO_AMISEQ_NO,candidate_mob_no, smsText, candidate_id)

                // print SID of the message you just sent
                console.log(messageData.dateCreated);
            }
        }
    )
}

module.exports.insertToCandidateMsg = (connection,from, to, text, candidate_id) => {
    connection.query(sql_queries.INSERT_CANDIDATE,
        [from, to, text , candidate_id ],
        function(err,result) {
            if(err) { console.log(err)  }
        })  
}

module.exports.sendMsgToCandidates = (smsText, candidateList, connection, bWithAmiseq) => {
    var twilioClient = new twilio(CONSTANTS.TWILIO_SID, CONSTANTS.TWILIO_TOKEN) 
    let arrayLength = candidateList.length
    for(let i=0; i < arrayLength; i++) {
        if(bWithAmiseq) { //only with Amiseq Inc.
            if(candidateList[i].client_id) {
                this.sendMsgToCandidate(twilioClient, connection, 
                    smsText,candidateList[i].candidate_id,
                    candidateList[i].mobile_no)
            }
        } else { //smsAll
            this.sendMsgToCandidate(twilioClient, connection, 
                                    smsText,candidateList[i].candidate_id,
                                    candidateList[i].mobile_no)
        }
    }
}

module.exports.deleteResume = (resume_filename) => {
    var filePath =  '.' + path.sep + 'resumes' + path.sep + resume_filename
    if(fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}

module.exports.deleteCandidatesResumes = (candidateArray, connection) => {
    let SQL = sql_queries.SELECT_CANDIDATE_RESUME_FILENAME +  `(` + candidateArray.join(',') + `)`
    console.log('deleteCandidatesResumes called')
    console.log('SQL=' + SQL)
    connection.query(SQL,
        [],
        function(err,result) {
            if(err) { console.log(err)  }
            else {
                for(let i=0; i < result.length; i++) {
                    //with client_id send the message to client.
                    console.log(result[i].resume_filename)
                    if(result[i].resume_filename !== '') {
                        //TODO: this call does not work!!!!
                       // this.deleteResume(result[i].resume_filename)
                       let filePath =  '.' + path.sep + 'resumes' + path.sep + result[i].resume_filename
                       if(fs.existsSync(filePath)) {
                           fs.unlinkSync(filePath)
                       }                       
                    }
                }
            }
        })       
}

module.exports.handelNullField = (field) => {
    if(field === '' || field === '0000-00-00') {
        return null
    }
    else {
        return field
    }
}