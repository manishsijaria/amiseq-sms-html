
var getConnection = require('../../config/dbconnection')
var modelsUtils = require('./modelsUtils')
var twilio = require('twilio')
var CONSTANTS = require('../../config/constants')

module.exports.twiliopost = (req, io, callback) => {
    //get the request params, From
    const { MessageSid, AccountSid, MessagingServiceSid,
            From, To, Body } = req.body
    console.log('=========== req.body of /receivesms/twiliopost ========== ')
    console.log(req.body)
    console.log('========================================================== ')
    //if From found in contact table, 
    const queryContact = `SELECT contact_id, mobile_no FROM contact WHERE mobile_no='` + From + `'`
    getConnection((err,connection)=> {
        connection.query(queryContact, [], (err, result) => {
            if(err) {
                console.log('Error in getting Contact Msgs list')
                connection.release()
                callback(null,err)
            } else {
                if(result.length) { //Found in contact table.
                    console.log(MessageSid);
                    //found, post the Body in message table.
                    modelsUtils.insertToMessage(connection,
                                                From,
                                                CONSTANTS.TWILIO_AMISEQ_NO, 
                                                Body, 
                                                result[0].contact_id,
                                                null) //null for user_id
                    modelsUtils.sendAndReceiveNotification(io, result[0].contact_id)            
                } 
            }
        })
                    
        connection.release()
        //respond with a template message "Thanks for sending us the message, we will get back to you as soon as possible. Amiseq Inc."
        const MessageResponse = twilio.twiml.MessagingResponse;
        var twiml = new MessageResponse();
        //twiml.message('Thanks for sending us the message, we will get back to you as soon as possible. Amiseq Inc.');
        
        //Send a empty response if you do not like to send any message in reply.
        var returnstring = twiml.toString()
        callback(returnstring, null)            
    })
}