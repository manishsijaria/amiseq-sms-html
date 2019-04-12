import { combineReducers } from 'redux'


import { clientsGet,selectedClients , clientsMsgs, clientMsgsCount } from './client.reducer'
import { candidatesGet, selectedCandidates,candidatesMsgs,candidateMsgsCount} from './candidate.reducer'


import { alert } from './alert.reducer'
import { contactsGet, contactsCount, contactMsgsCount,contactMsgs } from '../_reducers/contact.reducer'
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
    contactMsgsCount,
    contactMsgs,
    authentication,
    router: connectRouter(history),
})

export default createRootReducer