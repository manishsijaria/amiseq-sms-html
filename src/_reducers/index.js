
import { combineReducers } from 'redux'

import { alert } from './alert.reducer'
import { contactsGet, contactsCount, contactMsgsCount,contactMsgs } from '../_reducers/contact.reducer'
import { contactTypesGet } from './contactType.reducer'
import { userTypesGet } from './userType.reducer'
import { authentication } from './authentication.reducer'
import { connectRouter } from 'connected-react-router'

const createRootReducer = history =>  combineReducers({
    alert,
    contactTypesGet,
    contactsGet,
    contactsCount,
    contactMsgsCount,
    contactMsgs,
    userTypesGet,
    authentication,
    router: connectRouter(history),
})

export default createRootReducer