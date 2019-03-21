
import { contactConstants  } from '../_constants'
import { contactServices } from "../_services";

import { push } from 'connected-react-router'

export const contactActions = {
    addContact
}


function addContact(contact) {
    return dispatch => {
        contactServices.addContact(contact)
        .then(contact => {
            if(!contact || contact === undefined) {
                let e = 'Contact is already registered'
                dispatch(failure(e))
            } else {
                let ParseContact = JSON.parse(contact)
                dispatch(success(ParseContact))
                dispatch(push('/landingpage'))
            }
        })
    }
    function failure(error) { return { type: contactConstants.ADD_CONTACT_FAILURE, error } }
    function success(contact) { return { type: contactConstants.ADD_CONTACT_SUCCESS, contact }} 
}