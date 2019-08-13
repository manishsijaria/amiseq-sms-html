
'use strict'
let CONSTANTS = {
  TWILIO_SID : (process.env.NODE_ENV === 'production') ? process.env.TWILIO_SID : process.env.DEMO_TWILIO_SID,
  TWILIO_TOKEN : (process.env.NODE_ENV === 'production') ? process.env.TWILIO_TOKEN : process.env.DEMO_TWILIO_TOKEN,
  TWILIO_AMISEQ_NO : (process.env.NODE_ENV === 'production') ? process.env.TWILIO_NO : process.env.DEMO_TWILIO_NO,
  SERVER_PORT : process.env.PORT
}
module.exports = Object.freeze(CONSTANTS)  // freeze prevents changes by users

