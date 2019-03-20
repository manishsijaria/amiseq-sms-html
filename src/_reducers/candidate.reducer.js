
import { candidateConstants, selectedCandidatesConstants, 
        candidateMsgConstants, candidateMsgCountConstants } from '../_constants'

export function candidatesGet(state = {candidates:[]}, action) {
    switch(action.type) {
        case candidateConstants.GET_CANDIDATES_FAILURE:
            return {candidates: []}
        case candidateConstants.GET_CANDIDATES_SUCCESS:
            return {candidates: action.candidates}
        case candidateConstants.ADD_CANDIDATE_SUCCESS:
            return Object.assign({}, state,{ candidates:[...state.candidates, {...action.candidate}] } )
        case candidateConstants.EDIT_CANDIDATE_SUCCESS:
            return Object.assign({}, state, { candidates:
                                                state.candidates.map((candidate)=>{
                                                    if(candidate.candidate_id === action.candidate.candidate_id) {
                                                        return Object.assign({}, candidate, {...action.candidate})
                                                    }
                                                    return candidate
                                                })
                                })
        case candidateConstants.DELETE_CANDIDATES_SUCCESS:
            let tempCandidates = []
            state.candidates.forEach((candidate)=>{
                if(action.candidateArray.indexOf(candidate.candidate_id) !== -1) {
                    //don't add
                } else {
                    tempCandidates.push(candidate)
                }
            })
            return Object.assign({}, state, {candidates: tempCandidates})
        default:
            return state
    }
}

export function selectedCandidates(state = { candidateArray: [] }, action) {
    var   index = -1 
    const newState = [...state.candidateArray]
    switch(action.type) {
        case selectedCandidatesConstants.ADD_SELECTED_CANDIDATE:
             index = newState.indexOf(action.candidate_id)
             if(index === -1) {
                newState.push(action.candidate_id)
             }
            return {candidateArray: newState};
        case selectedCandidatesConstants.DELETE_SELECTED_CANDIDATE:
             index = newState.indexOf(action.candidate_id)
             if(index > -1) {
                 newState.splice(index,1)  //The second parameter of splice is the number of elements to remove.
             }
            return {candidateArray:newState};
        case selectedCandidatesConstants.DELETE_ALL_SELECTED_CANDIDATE:
             newState.splice(0, newState.length)
             return {candidateArray:newState};
        default:
            return state;
    }
}

export function candidatesMsgs(state = {candidatesMsgArray:[]}, action) {
    switch(action.type) {
        case candidateMsgConstants.GET_CANDIDATE_MSGS_SUCCESS:
            //alert('action.client_id=' + action.client_id)
            let newArray = JSON.parse(JSON.stringify(state.candidatesMsgArray))
            newArray[action.candidate_id] = action.candidateMsgs
            return Object.assign({}, state, {candidatesMsgArray: newArray }) 
        case candidateMsgConstants.GET_CANDIDATE_MSGS_FAILURE:
            return Object.assign({}, state, {[action.candidate_id] : []}) 
        default:
            return state
    }
}

export function candidateMsgsCount(state = 0, action) {
    switch(action.type) {
        case candidateMsgCountConstants.GET_CANDIDATE_MSGS_COUNT:
            return action.msgsCount 
        default:
            return state
    }
}