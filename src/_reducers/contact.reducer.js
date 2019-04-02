import { contactConstants } from '../_constants'

export function contactsGet(state = {contacts: []}, action) {
    switch(action.type) {
        case contactConstants.GET_CONTACTS_FAILURE:
            return {contacts: []}
        case contactConstants.GET_CONTACTS_SUCCESS:
            return {contacts: action.contacts}
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