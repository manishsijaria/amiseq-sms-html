
//NOTE: These constants are string so the env variables should be string(prefixed and suffixed by ')
export const ServerConstants = {
    TWILIO_AMISEQ_NO :  process.env.REACT_APP_TWILIO_NO ,
    SERVER_IP : process.env.REACT_APP_SERVER_IP ,
    SERVER_PORT :  process.env.REACT_APP_SERVER_PORT,
    TWILIO_MSG_LENGTH : 160,     //1 sms
    OUR_TWILIO_MSG_LENGTH : 640, //4 sms
};