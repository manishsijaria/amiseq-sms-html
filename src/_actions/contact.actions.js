
import { contactConstants  } from '../_constants'
import { contactServices } from "../_services";

import { push } from 'connected-react-router'
import { alertActions } from './alert.actions';

export const contactActions = {
    addContact,
    deleteContact,
    getContacts,
}


function addContact(contact) {
    return dispatch => {
        contactServices.addContact(contact)
        .then(contact => {
            if(!contact || contact === undefined) {
                let e = 'Mobile number is already registered'
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

function deleteContact(contact_id) {
    return dispatch => {
        contactServices.deleteContact(contact_id)
        .then(successMsg => {
            if(!successMsg || successMsg === undefined) {
                let e = 'Contact was not deleted'
                //dispatch(failure(e))
                //dispatch(alertActions.error(e))
            } else {
                dispatch(deleteContact(contact_id))
                //dispatch(push('/landingpage'))
            }
        })
    }
    function deleteContact(contact_id) { return { type: contactConstants.DELETE_CONTACT_SUCCESS, contact_id }}
}


function getContacts() {
    return (dispatch) => {
        contactServices.getContacts()
        .then(contacts => {
            if(!contacts || contacts === undefined) {
                let e = 'Error in getting contacts list'
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