import { createStore, applyMiddleware,compose } from 'redux'

import { history } from '../_helpers'
import { routerMiddleware } from 'connected-react-router'

import thunk from 'redux-thunk'
import createRootReducer from '../_reducers'
/*
export const store = createStore(connectRouter(history)(rootReducer),
                                 compose(applyMiddleware(routerMiddleware(history),thunk)));
*/

export const store = createStore(
    createRootReducer(history),  //root reducer
    compose(
        applyMiddleware(
            routerMiddleware(history), //for dispaching history actions.
            thunk,
            //other middlewares
        ), 
    ),
)
