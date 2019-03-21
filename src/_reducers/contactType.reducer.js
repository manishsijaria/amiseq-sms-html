
import { contactTypeConstants } from '../_constants'

export function contactTypesGet(state = {contactTypes: []}, action) {
    switch(action.type) {
        case contactTypeConstants.GET_CONTACT_TYPE_FAILURE:
            return {contactTypes: []}
        case contactTypeConstants.GET_CONTACT_TYPE_SUCCESS:
            return {contactTypes: action.contactTypes}
        default:
            return state
    }
}
