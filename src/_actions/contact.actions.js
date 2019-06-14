
import { contactConstants, msgConstants,contactMsgConstants } from '../_constants'
import { contactServices } from "../_services";

import { push } from 'connected-react-router'
import { alertActions } from './alert.actions';
import { FetchContactConstants } from '../_constants'

export const contactActions = {
    addContact,
    deleteContact,
    getContacts,
    getContactsCount,
    getMsgsCount,
    incrementMsgsCount,
    getContactMsgs,
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
                //let e = 'Contact was not deleted'
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


function getContacts(offset, count, filterText) {
    return (dispatch) => {
        //KB: When the OrderChanged event is fired, the count doesn't change
        //    but we need to reset the contacts.
        if(offset === FetchContactConstants.MINIMUM_START_INDEX) {
            dispatch(reset())
        }
        
        contactServices.getContacts(offset, count, filterText)
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
    function reset() { return {type: contactConstants.RESET_CONTACTS }}
}

function getContactsCount(filterText) {
    return (dispatch) => {
        dispatch(request(true))     //Set the isFetchingContactCount=true
        dispatch(resetContacts())   //reset all contacts

        contactServices.getContactsCount(filterText)
        .then(count => {
                if(count === undefined) {
                    dispatch(failure())
                } else {
                    dispatch(success(count))
                }
            }
        )
    }
    function resetContacts() { return {type: contactConstants.RESET_CONTACTS } }
    function request(isFetching) { return {type: contactConstants.GET_CONTACTS_COUNT_REQUEST, isFetching} }
    function failure() { return {type: contactConstants.GET_CONTACTS_COUNT_FAILURE} }
    function success(count) { return {type: contactConstants.GET_CONTACTS_COUNT_SUCCESS, count }}
}

function getMsgsCount( contact_id) {
    return (dispatch) => {
        contactServices.getMsgsCount( contact_id)
        .then(count => {
            dispatch(success(count))
        })
    }
    function success(count) { return {type: msgConstants.GET_MSGS_COUNT, contact_id, count }}
}

function incrementMsgsCount(contact_id, by) {
    return (dispatch) => {
        dispatch(success(contact_id, by))
    }
    function success(contact_id, by) { return {type: msgConstants.INCREMENT_MSGS_COUNT, contact_id, by} }
}

function getContactMsgs(offset, count, contact_id) {
    return (dispatch) => {
        contactServices.getContactMsgs(offset, count, contact_id)
        .then(contactMsgs => {
            if(!contactMsgs || contactMsgs === undefined) {
                let e = 'Error in getting contact Messages'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedContactMsgs = JSON.parse(contactMsgs)
                dispatch(success(contact_id,ParsedContactMsgs)) 
            }
        })
    }
    function failure(error) { return {type: contactMsgConstants.GET_CONTACT_MSGS_FAILURE, error }}
    function success(contact_id, contactMsgs) { return {type: contactMsgConstants.GET_CONTACT_MSGS_SUCCESS, contact_id, contactMsgs }}      
}