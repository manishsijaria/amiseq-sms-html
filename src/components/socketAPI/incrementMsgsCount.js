

import { ServerConstants } from '../../_constants'

import socketIOClient  from 'socket.io-client';

const  serverSocket  = socketIOClient(ServerConstants.SERVER_IP + ':' 
                                    + ServerConstants.SERVER_PORT   + '/sendAndReceive');
function incrementMsgsCount(cb) {
   //data emitted by msgCount from server.
  // alert('called')
  serverSocket.on('incrementMsgsCount', data => cb(null, data));
}
export { incrementMsgsCount };
