
import { userConstants } from '../_constants'
import { userService } from '../_services'
import { alertActions } from './'

import { push } from 'connected-react-router'

export const userActions = {
    login,
    logout,
    register,
    smsSend,
}

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        
        userService.login(username, password)
            .then(
                user => {
                    //alert('Login Success on Client:' + user)
                    if(!user || user === 'undefined') {
                        let e = 'Username or Password incorrect, Try Again!'
                        dispatch(failure(e))
                        dispatch(alertActions.error(e))    
                    } else {
                        dispatch(alertActions.clear())
                        let Parseduser = JSON.parse(user)
                        dispatch(success(Parseduser))
                        dispatch(push('/landingpage'))
                    }
                })
    }
    function request(user) { return {type: userConstants.LOGIN_REQUEST, user }}
    function success(user) { return {type: userConstants.LOGIN_SUCCESS, user}}
    function failure(error) { return {type: userConstants.LOGIN_FAILURE, error}}
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    if(!user || user === 'undefined') {
                        //alert(JSON.stringify(user))
                        let e = 'Username or Email already registered'
                        dispatch(failure(e))
                        dispatch(alertActions.error(e))    
                    } else {
                        //alert(JSON.stringify(user))
                        dispatch(alertActions.clear())  
                        dispatch(success());
                        dispatch(alertActions.success('Registration successful'));
                        dispatch(push('/login'))
                    }
                } 
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}



function smsSend(user_id , smsText, contactArray, bDispatchAlert=true) {
    return dispatch => {
        //alert(clientArray.length)
        userService.smsSend(user_id, smsText, contactArray)
        .then(success => {
            if(!success || success === 'undefined') {
                let e = 'Failed to send SMS to selected contacts'
                dispatch(alertActions.error(e))
            } else {
                //let ParsedSuccess = JSON.parse(success)
                if(!bDispatchAlert) { return }
                dispatch(alertActions.success('SMS send to selected contacts'))
            }            
        })
    }
}