import { contactConstants , msgConstants, contactMsgConstants } from '../_constants'

export function contactsGet(state = {contacts: []}, action) {
    switch(action.type) {
        case contactConstants.GET_CONTACTS_FAILURE:
            return {contacts: []}
        case contactConstants.GET_CONTACTS_SUCCESS:
            return {contacts: [...state.contacts, ...action.contacts]}
        case contactConstants.RESET_CONTACTS:
            return {contacts: []}

        case contactConstants.ADD_CONTACT_SUCCESS:
            return Object.assign({}, state, { contacts:[...state.contacts, {...action.contact}]})
            
        case contactConstants.DELETE_CONTACT_SUCCESS:
            let tempContacts = []
            state.contacts.forEach((contact)=> {
                if(action.contact_id  === contact.contact_id) {
                    //don't add
                } else {
                    tempContacts.push(contact)
                }
            })
            return Object.assign({}, state, { contacts: tempContacts } )            
        default:
            return state
    }
}

export function contactsCount(state = 0, action) {
    switch(action.type) {
        case contactConstants.GET_CONTACTS_COUNT_SUCCESS:
            //alert(action.count)
            return action.count 
        default:
            return state
    }
}

export function contactMsgsCount(state = {contactMsgsCountArray: []}, action) {
    switch(action.type) {
        case msgConstants.GET_MSGS_COUNT:
            let newArray = JSON.parse(JSON.stringify(state.contactMsgsCountArray)) 
            newArray[action.contact_id] = action.count
            return Object.assign({}, state, {contactMsgsCountArray: newArray })  
        default:
            return state
    }
}

export function contactMsgs(state = {contactsMsgArray:[]}, action) {
    let newArray
    switch(action.type) {
        case contactMsgConstants.GET_CONTACT_MSGS_SUCCESS:
            let reverseMsgs = action.contactMsgs.reverse()
            //alert('action.client_id=' + action.client_id)
            newArray = JSON.parse(JSON.stringify(state.contactsMsgArray))
            if(!newArray[action.contact_id]) {
                newArray[action.contact_id] = []
            } 
            newArray[action.contact_id] =  [...reverseMsgs, ...newArray[action.contact_id]]
            //return {contactsMsgArray: [...state.contactsMsgArray, ...action.contacts]}
            return Object.assign({}, state, {contactsMsgArray: newArray }) 

        case contactMsgConstants.GET_CONTACT_MSGS_FAILURE:
            return Object.assign({}, state, {[action.contact_id] : []}) 

        case contactMsgConstants.RESET_MSGS:
            newArray = JSON.parse(JSON.stringify(state.contactsMsgArray))
            newArray[action.contact_id] = []
            return Object.assign({}, state, {contactsMsgArray: newArray }) 
            
        default:
            return state
    }
}