import { contactConstants } from '../_constants'

export function contactsGet(state = {contacts: []}, action) {
    switch(action.type) {
        case contactConstants.GET_CONTACTS_FAILURE:
            return {contacts: []}
        case contactConstants.GET_CONTACTS_SUCCESS:
            return {contacts: action.contacts}
        case contactConstants.ADD_CONTACT_SUCCESS:
            return Object.assign({}, state, { contacts:[...state.contacts, {...action.contact}]})
        default:
            return state
    }
}