
import { userTypeConstants } from '../_constants'

export function userTypesGet(state = {userTypes: []}, action) {
    switch(action.type) {
        case userTypeConstants.GET_USER_TYPE_FAILURE:
            return {userTypes: []}
        case userTypeConstants.GET_USER_TYPE_SUCCESS:
            return {userTypes: action.userTypes}
        default:
            return state
    }
}
