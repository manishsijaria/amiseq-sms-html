
var getConnection = require('../../config/dbconnection')
var modelsUtils = require('./modelsUtils')
var twilio = require('twilio')
var CONSTANTS = require('../../config/constants')

module.exports.twiliopost = (req, callback) => {
    //get the request params, From
    const { MessageSid, AccountSid, MessagingServiceSid,
            From, To, Body } = req.body
    //if From found in client table, 
    const queryClient = `SELECT client_id, mobile_no FROM client WHERE mobile_no=` + `'` + From + `'`
    getConnection((err,connection)=> {
        connection.query(queryClient, [], (err, result) => {
            if(err) {
                console.log('Error in getting Clients Msgs list')
                connection.release()
                callback(null,err)
            } else {
                if(result.length) { //Found in client table.
                    //found post the Body in client_msg table.
                    modelsUtils.insertToClientMsg(connection,From,CONSTANTS.TWILIO_AMISEQ_NO, Body, result[0].client_id)
                } else {
                    //else From should be in candidate table, post the Body in candidate_msg table.
                    const queryCandidate = `SELECT candidate_id, mobile_no FROM candidate WHERE mobile_no=` + `'` + From + `'`
                    connection.query(queryCandidate,[],(err, result) => {
                        if(err) { console.log(err)}
                        else {
                            if(result.length) {
                                modelsUtils.insertToCandidateMsg(connection,From,CONSTANTS.TWILIO_AMISEQ_NO,Body, result[0].candidate_id)
                            }                           
                        }
                    })
                    
                }
                connection.release()
                //respond with a template message "Thanks for sending us the message, we will get back to you as soon as possible. Amiseq Inc."
                const MessageResponse = twilio.twiml.MessagingResponse;
                var twiml = new MessageResponse();
                //twiml.message('Thanks for sending us the message, we will get back to you as soon as possible. Amiseq Inc.');
                
                //Send a empty response if you do not like to send any message in reply.
                var returnstring = twiml.toString()
                callback(returnstring, null)
            }
        })
    })    
}