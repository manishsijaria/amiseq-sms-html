
import 'whatwg-fetch' //in each file before using fetch

export const contactTypeServices = {
    getContactTypes,
}

function getContactTypes() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/api/contactTypes/getContactTypes', requestOptions)
            .then(response =>{
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Contact Types")
            })
            .then(contactTypes => {return contactTypes})
            .catch(err => {console.log(err)})
}
