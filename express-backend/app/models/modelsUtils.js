var CONSTANTS = require('../../config/constants')
var winston = require('../../config/winston');
var twilio = require('twilio')

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
                winston.log('info', '============ Error  in sending message from Server to twilio =========')
                winston.log('error',err)
                winston.log('info','=======================================================================')
            } else {
                this.insertToMessage(connection, 
                                     CONSTANTS.TWILIO_AMISEQ_NO, 
                                     contactList[i].mobile_no, 
                                     smsText,
                                     contactList[i].contact_id,
                                     user_id 
                                     )
                // print SID of the message you just sent
                winston.log('info','============= Msg Send to Contacts ===================================')
                winston.log('info',messageData.sid);
                winston.log('info',smsText)
                winston.log('info','=======================================================================')
                this.sendAndReceiveNotification(io, contactList[i].contact_id)
            }
        })  
    }
}

module.exports.sendAndReceiveNotification = (io, contact_id) => {
    //KB: Trigger requires certain time to update the contact table, therefore 500ms delay.
    setTimeout(()=> {
        let sendAndReceiveNSP= io.of('/sendAndReceive');
        winston.log('info','=====sending incrementMsgsCount to sockets ========')
        sendAndReceiveNSP.emit('incrementMsgsCount', {contact_id: contact_id, by: 1}); 
    },500)  
}

module.exports.insertToMessage = (connection, from, to, text, contact_id, user_id) => {
    connection.query(utils_sql_queries.INSERT_MESSAGE,
        [from, to, text ,contact_id, user_id ],
        function(err,result) {
                if(err) {  console.log(err)  }
        })   
}

