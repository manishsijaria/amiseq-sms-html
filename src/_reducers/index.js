import { combineReducers } from 'redux'

import { alert } from './alert.reducer'
import { clientsGet,selectedClients , clientsMsgs, clientMsgsCount } from './client.reducer'
import { candidatesGet, selectedCandidates,candidatesMsgs,candidateMsgsCount} from './candidate.reducer'

import { contactsGet, contactsCount } from '../_reducers/contact.reducer'
import { contactTypesGet } from './contactType.reducer'
import { authentication } from './authentication.reducer'

import { connectRouter } from 'connected-react-router'

const createRootReducer = history =>  combineReducers({

    clientsGet,
    selectedClients,
    candidatesGet,
    selectedCandidates,
    clientsMsgs,
    clientMsgsCount,
    candidatesMsgs,
    candidateMsgsCount,

    alert,
    contactTypesGet,
    contactsGet,
    contactsCount,
    authentication,
    router: connectRouter(history),
})

export default createRootReducer