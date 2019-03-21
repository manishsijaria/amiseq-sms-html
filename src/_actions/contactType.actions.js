
import { contactTypeConstants  } from '../_constants'
import { contactTypeServices } from '../_services'

export const contactTypeActions = {
    getContactTypes
}


function getContactTypes() {
    return (dispatch) => {
        contactTypeServices.getContactTypes()
        .then(contactTypes => {
            if(!contactTypes || contactTypes === undefined) {
                let e = 'Error in getting Contact Types'
                dispatch(failure(e))
            } else {
                let ParsedContactTypes = JSON.parse(contactTypes)
                dispatch(success(ParsedContactTypes))
            }
        })
    }
    function failure(error) { return {type: contactTypeConstants.GET_CONTACT_TYPE_FAILURE, error }}
    function success(contactTypes) { return {type: contactTypeConstants.GET_CONTACT_TYPE_SUCCESS, contactTypes }}

}