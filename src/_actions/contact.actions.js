
import { contactConstants  } from '../_constants'
import { contactServices } from "../_services";

import { push } from 'connected-react-router'
import { alertActions } from './alert.actions';

export const contactActions = {
    addContact,
    getContacts,
}


function addContact(contact) {
    return dispatch => {
        contactServices.addContact(contact)
        .then(contact => {
            if(!contact || contact === undefined) {
                let e = 'Contacts mobile number is already registered'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
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

function getContacts(user_id) {
    return (dispatch) => {
        contactServices.getContacts(user_id)
        .then(contacts => {
            if(!contacts || contacts === undefined) {
                let e = 'Error in getting contacts List'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedContacts = JSON.parse(contacts)
                dispatch(success(ParsedContacts)) 
            }

        })
    }
    function failure(error) { return {type: contactConstants.GET_CONTACTS_FAILURE, error }}
    function success(contacts) { return {type: contactConstants.GET_CONTACTS_SUCCESS , contacts }}
}