

import { candidateConstants, selectedCandidatesConstants, 
        candidateMsgConstants, candidateMsgCountConstants } from '../_constants'
import { alertActions } from '../_actions'
import { candidateServices } from '../_services'

import { push } from 'connected-react-router'

export const candidateActions = {
    addCandidate,
    editCandidate,
    getCandidates,
    addSelectedCandidate,
    deleteSelectedCandidate,
    deleteCandidates,
    smsAll,
    smsChecked,
    getCandidateMsgs,
    getCandidateMsgsCount,
    downloadResume
}

function addCandidate(candidate) {
    return dispatch => {
        candidateServices.addCandidate(candidate)
        .then(candidate => {
            if(!candidate || candidate === 'undefined') {
                let e = 'Candidate is already registered'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedCandidate = JSON.parse(candidate)
                dispatch(success(ParsedCandidate))
                dispatch(alertActions.success('Added Candidate successfully !'))
                dispatch(push('/candidates')) //To Show the newly added client in the table.
            }
        })
    }
    function failure(error) { return { type: candidateConstants.ADD_CANDIDATE_FAILURE, error } }
    function success(candidate) { return { type: candidateConstants.ADD_CANDIDATE_SUCCESS, candidate }}
} 

function editCandidate(number, candidate) {
    return dispatch => {
        candidateServices.editCandidate(number, candidate)
        .then(candidate =>{
            if(!candidate || candidate === 'undefined') {
                let e = 'Candidate details can not be saved'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedCandidate = JSON.parse(candidate)
                dispatch(success(ParsedCandidate))
                dispatch(alertActions.success('Saved Candidate successfully !'))
                dispatch(push('/candidates'))
            }
        })
    }
    function failure(error) { return { type: candidateConstants.EDIT_CANDIDATE_FAILURE, error }}
    function success(candidate) { return {type: candidateConstants.EDIT_CANDIDATE_SUCCESS, candidate }}    
}

function getCandidates() {
    return (dispatch) => {
        candidateServices.getCandidates()
        .then(candidates => {
            if(!candidates || candidates === 'undefined') {
                let e = 'Error in getting Candidates List'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedCandidates = JSON.parse(candidates)
                dispatch(success(ParsedCandidates)) 
            }

        })
    }
    function failure(error) { return {type: candidateConstants.GET_CANDIDATES_FAILURE, error }}
    function success(candidates) { return {type: candidateConstants.GET_CANDIDATES_SUCCESS, candidates }}    
}

function deleteCandidates(candidateArray) {
    return (dispatch) => {
        candidateServices.deleteCandidates(candidateArray)
        .then(successMsg => {
            if(!successMsg || successMsg === 'undefined') {
                //let e = 'Error in deleting selected candidates'
            } else {
                dispatch(deleteCandidates(candidateArray))
                dispatch(deleteAllSelectedCandidates())
            }
        })
    }
    function deleteCandidates(candidateArray) { return { type: candidateConstants.DELETE_CANDIDATES_SUCCESS, candidateArray }}
    function deleteAllSelectedCandidates() { return { type: selectedCandidatesConstants.DELETE_ALL_SELECTED_CANDIDATE }}    
}
//======================= Select Candidate Actions ===================
function addSelectedCandidate(candidate_id) {
    return (dispatch) => {
        dispatch(checkedCandidate(candidate_id))
    }
    function checkedCandidate(candidate_id) { return {type: selectedCandidatesConstants.ADD_SELECTED_CANDIDATE, candidate_id }}
}

function deleteSelectedCandidate(candidate_id) {
    return (dispatch) => {
        dispatch(uncheckCandidate(candidate_id))
    }
    function uncheckCandidate(candidate_id) { return {type: selectedCandidatesConstants.DELETE_SELECTED_CANDIDATE, candidate_id }}
}

//======================= SMS Actions ===================
function smsAll(param, smsText) {
    return dispatch => {
        candidateServices.smsAll(param,smsText)
        .then(success => {
            if(!success || success === 'undefined') {
                let e = 'Failed to send SMS to all Candidates'
                dispatch(alertActions.error(e))
            } else {
                //let ParsedSuccess = JSON.parse(success)
                if(param === 'HIRED_IN_AMISEQ') {
                    dispatch(alertActions.success('SMS send to all candidates with Amiseq Inc.'))
                } else {
                    dispatch(alertActions.success('SMS send to all candidates'))
                }
            }
        })
    }
}

function smsChecked(smsText, candidateArray, bDispatchAlert=true) {
    return dispatch => {
        //alert(clientArray.length)
        candidateServices.smsChecked(smsText, candidateArray)
        .then(success => {
            if(!success || success === 'undefined') {
                let e = 'Failed to send SMS to selected Candidates'
                dispatch(alertActions.error(e))
            } else {
                //let ParsedSuccess = JSON.parse(success)
                if(!bDispatchAlert) { return }
                dispatch(alertActions.success('SMS send to selected candidates'))
                
            }            
        })
    }    
}


//===================== Client Messages =================================
function getCandidateMsgs(candidate_id,fetchText ) {
    return (dispatch) => {
        candidateServices.getCandidateMsgs(candidate_id,fetchText)
        .then(candidateMsgs => {
            if(!candidateMsgs || candidateMsgs === 'undefined') {
                let e = 'Error in getting Candidate Messages'
                dispatch(failure(e))
                dispatch(alertActions.error(e))
            } else {
                let ParsedCandidateMsgs = JSON.parse(candidateMsgs)
                dispatch(success(candidate_id, ParsedCandidateMsgs)) 
            }

        })
    }
    function failure(error) { return {type: candidateMsgConstants.GET_CANDIDATE_MSGS_FAILURE, error }}
    function success(candidate_id, candidateMsgs) { return {type: candidateMsgConstants.GET_CANDIDATE_MSGS_SUCCESS, candidate_id, candidateMsgs }}    
}

function getCandidateMsgsCount(candidate_id, fetchText) {
    return (dispatch) => {
        candidateServices.getCandidateMsgsCount(candidate_id, fetchText)
        .then(msgsCount => {
            dispatch(success(msgsCount))
        })
    }
    function success(msgsCount) { return {type: candidateMsgCountConstants.GET_CANDIDATE_MSGS_COUNT, msgsCount }}
}

function downloadResume(resume_filename) {
    return (dispatch) => {
        candidateServices.downloadResume(resume_filename)
    }
}