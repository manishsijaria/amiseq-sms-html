
import { userTypeConstants  } from '../_constants'
import { userTypeServices } from '../_services'

export const userTypeActions = {
    getUserTypes
}


function getUserTypes() {
    return (dispatch) => {
        userTypeServices.getUserTypes()
        .then(userTypes => {
            if(!userTypes || userTypes === undefined) {
                let e = 'Error in getting User Types'
                dispatch(failure(e))
            } else {
                let ParsedUserTypes = JSON.parse(userTypes)
                dispatch(success(ParsedUserTypes))
            }
        })
    }
    function failure(error) { return {type: userTypeConstants.GET_USER_TYPE_FAILURE, error }}
    function success(userTypes) { return {type: userTypeConstants.GET_USER_TYPE_SUCCESS, userTypes }}
}
