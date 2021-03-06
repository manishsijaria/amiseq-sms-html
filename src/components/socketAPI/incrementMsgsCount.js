

import { ServerConstants } from '../../_constants'

import socketIOClient  from 'socket.io-client';

//NOTE: Fix for first client does not get send/received msg. 
//      Also, fix for "WebSocket is already in CLOSING or CLOSED state." on the browser console.
//Ref:- https://socket.io/docs/client-api/
// forceNew (Boolean) whether to reuse an existing connection
// {forceNew: true}, will create distinct connections, on different imports of the file.
// reconnection : if the client internet connection drops, this option trys to reconnect.
let serverIPAndPort = ServerConstants.SERVER_IP + ':' + ServerConstants.SERVER_PORT  

let path = (process.env.REACT_APP_SERVER_SUBFOLDER) ? '/' + process.env.REACT_APP_SERVER_SUBFOLDER : ''
//serverIPAndPort = serverIPAndPort +  (process.env.REACT_APP_SERVER_SUBFOLDER) ? '/' + process.env.REACT_APP_SERVER_SUBFOLDER : '' 
path = path + '/sendAndReceive'

let  serverSocket  = socketIOClient(serverIPAndPort + path,
                                    { 
                                      //path: `${path}`, 
                                      //transports:['websocket'],
                                      forceNew: true, 
                                      reconnection: true,
                                      reconnectionDelay: 1000,
                                      reconnectionDelayMax: 5000,
                                      reconnectionAttempts: Infinity,
                                      timeout: 6000,
                                      //secure: true,
                                      //rejectUnauthorized: false
                                    });
                                    
function incrementMsgsCount(cb) {
   //data emitted by msgCount from server.
  // alert('called')
  serverSocket.on('incrementMsgsCount', data => cb(null, data));
}
export { incrementMsgsCount };
