
'use strict'
let CONSTANTS = {
  TWILIO_SID : process.env.TWILIO_SID,
  TWILIO_TOKEN : process.env.TWILIO_TOKEN,
  TWILIO_AMISEQ_NO : process.env.TWILIO_NO,
  SERVER_PORT : process.env.SERVER_PORT
}
module.exports = Object.freeze(CONSTANTS)  // freeze prevents changes by users

