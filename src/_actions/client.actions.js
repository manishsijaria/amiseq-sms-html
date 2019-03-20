
import { clientConstants, selectedClientsConstants, clientMsgConstants,clientMsgCountConstants  } from '../_constants'
import { alertActions } from '../_actions'
import { clientServices } from '../_services'

import { push } from 'connected-react-router'

export const clientActions = {
    addClient,
    editClient,
    getClients,
    deleteClients,
    addSelectedClient,
    deleteSelectedClient,
    smsAll,
    smsChecked,
    getClientMsgs,
    getClientMsgsCount,
}

/*KB:
 A thunk is a function that returns a function. here addClient
 thunk Returns a function that accepts `dispatch` so we can dispatch later.
 
 Redux Thunk middleware allows you to write action creators that return 
 a function instead of an action. 
 The thunk can be used to delay the dispatch of an action, or 
   to dispatch only if a certain condition is met.  
This is very useful for server side rendering, because I can wait 
until data is available, then synchronously render the app.
*/
function addClient(client) {
    return dispatch => {
        clientServices.addClient(client)
        .then(client => {
            if(!client || client === 'undefined') {
                let e = 'Client is already registered'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedClient = JSON.parse(client)
                dispatch(success(ParsedClient))
                dispatch(alertActions.success('Added Client successfully !'))
                dispatch(push('/clients')) //To Show the newly added client in the table.
            }
        })
    }
    function failure(error) { return { type: clientConstants.ADD_CLIENT_FAILURE, error } }
    function success(client) { return { type: clientConstants.ADD_CLIENT_SUCCESS, client }} 
}

function editClient(number, client) {
    return dispatch => {
        clientServices.editClient(number, client)
        .then(client =>{
            if(!client || client === 'undefined') {
                let e = 'Client details can not be saved'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedClient = JSON.parse(client)
                dispatch(success(ParsedClient))
                dispatch(alertActions.success('Saved Client successfully !'))
                dispatch(push('/clients'))
            }
        })
    }
    function failure(error) { return { type: clientConstants.EDIT_CLIENT_FAILURE, error }}
    function success(client) { return {type: clientConstants.EDIT_CLIENT_SUCCESS, client }}
}

function getClients() {
    return (dispatch) => {
        clientServices.getClients()
        .then(clients => {
            if(!clients || clients === 'undefined') {
                let e = 'Error in getting Client List'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedClients = JSON.parse(clients)
                dispatch(success(ParsedClients)) 
            }

        })
    }
    function failure(error) { return {type: clientConstants.GET_CLIENTS_FAILURE, error }}
    function success(clients) { return {type: clientConstants.GET_CLIENTS_SUCCESS, clients }}

}

function deleteClients(clientArray) {
    return (dispatch) => {
        clientServices.deleteClients(clientArray)
        .then(successMsg => {
            if(!successMsg || successMsg === 'undefined') {
                //let e = 'Error in deleting selected clients'
            } else {
                dispatch(deleteClients(clientArray))
                dispatch(deleteAllSelectedClients())
            }
        })
    }
    function deleteClients(clientArray) { return { type: clientConstants.DELETE_CLIENTS_SUCCESS, clientArray }}
    function deleteAllSelectedClients() { return { type: selectedClientsConstants.DELETE_ALL_SELECTED_CLIENT }}
}

//======================= Select Client Actions ===================
function addSelectedClient(client_id) {
    return (dispatch) => {
        dispatch(checkedClient(client_id))
    }
    function checkedClient(client_id) { return {type: selectedClientsConstants.ADD_SELECTED_CLIENT, client_id }}
}

function deleteSelectedClient(client_id) {
    return (dispatch) => {
        dispatch(uncheckClient(client_id))
    }
    function uncheckClient(client_id) { return {type: selectedClientsConstants.DELETE_SELECTED_CLIENT, client_id }}
}

//======================= SMS Actions ===================

function smsAll(param, smsText) {
    return dispatch => {
        clientServices.smsAll(param,smsText)
        .then(success => {
            if(!success || success === 'undefined') {
                let e = 'Failed to send SMS to all Clients'
                dispatch(alertActions.error(e))
            } else {
                //let ParsedSuccess = JSON.parse(success)
                if(param === 'WITH_ASSOC_CANDIDATES') {
                    dispatch(alertActions.success('SMS send to all clients with Associated candidates'))
                } else {
                    dispatch(alertActions.success('SMS send to all clients'))
                }
            }
        })
    }
}

function smsChecked(param,smsText, clientArray, bDispatchAlert=true) {
    return dispatch => {
        //alert(clientArray.length)
        clientServices.smsChecked(param,smsText, clientArray)
        .then(success => {
            if(!success || success === 'undefined') {
                let e = 'Failed to send SMS to selected Clients'
                dispatch(alertActions.error(e))
            } else {
                //let ParsedSuccess = JSON.parse(success)
                if(!bDispatchAlert) { return }
                if(param === 'WITH_ASSOC_CANDIDATES') {
                    dispatch(alertActions.success('SMS send to selected clients with associated candidates'))
                } else {
                    dispatch(alertActions.success('SMS send to selected clients'))
                }
            }            
        })
    }
}
//===================== Client Messages =================================
function getClientMsgs(client_id,fetchText ) {
    return (dispatch) => {
        clientServices.getClientMsgs(client_id,fetchText)
        .then(clientMsgs => {
            if(!clientMsgs || clientMsgs === 'undefined') {
                let e = 'Error in getting Client Messages'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedClientMsgs = JSON.parse(clientMsgs)
                dispatch(success(client_id,ParsedClientMsgs)) 
            }

        })
    }
    function failure(error) { return {type: clientMsgConstants.GET_CLIENT_MSGS_FAILURE, error }}
    function success(client_id, clientMsgs) { return {type: clientMsgConstants.GET_CLIENT_MSGS_SUCCESS, client_id, clientMsgs }}    
}

function getClientMsgsCount(client_id, fetchText) {
    return (dispatch) => {
        clientServices.getClientMsgsCount(client_id, fetchText)
        .then(msgsCount => {
            dispatch(success(msgsCount))
        })
    }
    function success(msgsCount) { return {type: clientMsgCountConstants.GET_CLIENT_MSGS_COUNT, msgsCount }}
}