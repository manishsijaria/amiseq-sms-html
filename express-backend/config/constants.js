/*
module.exports = {
    key: 'API Keys',
    //secret: 'eqNJ5sP94fDlQarQUbowmQGcnxio6WMk',
    //sid: 'SK333f32a28a75e03a2ce6963a9d43d8d9'
    sid: 'AC5774ab43aff86ef0775242ed23677527',
    token: '29e2bb8564b7335b61d309bf50901ed5',
    amiseq_no: '+15005550006'
  }
*/
'use strict'
let CONSTANTS = {
  TWILIO_SID : 'AC5774ab43aff86ef0775242ed23677527',
  TWILIO_TOKEN : '29e2bb8564b7335b61d309bf50901ed5',
  TWILIO_AMISEQ_NO : '+15005550006',
  SERVER_PORT : '3001'
}
module.exports = Object.freeze(CONSTANTS)  // freeze prevents changes by users

/*
export const TWILIO_SID = 'AC5774ab43aff86ef0775242ed23677527'
export const TWILIO_TOKEN = '29e2bb8564b7335b61d309bf50901ed5'
export const TWILIO_AMISEQ_NO = '+15005550006'
*/