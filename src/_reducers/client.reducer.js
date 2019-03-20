
import { clientConstants , selectedClientsConstants, clientMsgConstants, clientMsgCountConstants } from '../_constants'


export function clientsGet(state = {clients: []}, action) {
    switch(action.type) {
        case clientConstants.GET_CLIENTS_FAILURE:
            return {clients: []}
        case clientConstants.GET_CLIENTS_SUCCESS:
            return {clients: action.clients}
        case clientConstants.ADD_CLIENT_SUCCESS:
            return Object.assign({}, state, { clients:[...state.clients, {...action.client}] } )
        case clientConstants.EDIT_CLIENT_SUCCESS:
            return Object.assign({}, state, { clients: 
                                                state.clients.map((client) => {
                                                        if(client.client_id === action.client.client_id){
                                                            return Object.assign({}, client, {...action.client})                                                                                
                                                        }
                                                        return client
                                                })
                                            } 
                                )
        case clientConstants.DELETE_CLIENTS_SUCCESS:
            let tempClients = []
            state.clients.forEach((client)=> {
                if(action.clientArray.indexOf(client.client_id) !== -1) {
                    //don't add
                } else {
                    tempClients.push(client)
                }
            })
            return Object.assign({}, state, { clients: tempClients } )
        default:
            return state
    }
}

export function selectedClients(state = { clientArray: [] }, action) {
    var   index = -1 
    const newState = [...state.clientArray]
    switch(action.type) {
        case selectedClientsConstants.ADD_SELECTED_CLIENT:
             index = newState.indexOf(action.client_id)
             if(index === -1) {
                newState.push(action.client_id)
             }
            return {clientArray: newState};
        case selectedClientsConstants.DELETE_SELECTED_CLIENT:
             index = newState.indexOf(action.client_id)
             if(index > -1) {
                 newState.splice(index,1)  //The second parameter of splice is the number of elements to remove.
             }
            return {clientArray:newState};
        case selectedClientsConstants.DELETE_ALL_SELECTED_CLIENT:
             newState.splice(0, newState.length)
             return {clientArray:newState};
        default:
            return state;
    }
}

export function clientsMsgs(state = {clientsMsgArray:[]}, action) {
    switch(action.type) {
        case clientMsgConstants.GET_CLIENT_MSGS_SUCCESS:
            //alert('action.client_id=' + action.client_id)
            let newArray = JSON.parse(JSON.stringify(state.clientsMsgArray))
            newArray[action.client_id] = action.clientMsgs
            return Object.assign({}, state, {clientsMsgArray: newArray }) 
        case clientMsgConstants.GET_CLIENT_MSGS_FAILURE:
            return Object.assign({}, state, {[action.client_id] : []}) 
        default:
            return state
    }
}

export function clientMsgsCount(state = 0, action) {
    switch(action.type) {
        case clientMsgCountConstants.GET_CLIENT_MSGS_COUNT:
            return action.msgsCount 
        default:
            return state
    }
}