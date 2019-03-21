import { combineReducers } from 'redux'

import { alert } from './alert.reducer'
import { clientsGet,selectedClients , clientsMsgs, clientMsgsCount } from './client.reducer'
import { candidatesGet, selectedCandidates,candidatesMsgs,candidateMsgsCount} from './candidate.reducer'

import { contactTypesGet } from './contactType.reducer'
import { authentication } from './authentication.reducer'

import { connectRouter } from 'connected-react-router'

const createRootReducer = history =>  combineReducers({
    alert,
    clientsGet,
    selectedClients,
    candidatesGet,
    selectedCandidates,
    clientsMsgs,
    clientMsgsCount,
    candidatesMsgs,
    candidateMsgsCount,

    contactTypesGet,
    authentication,
    router: connectRouter(history),
})

export default createRootReducer