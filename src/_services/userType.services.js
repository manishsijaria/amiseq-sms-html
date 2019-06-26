
import 'whatwg-fetch' //in each file before using fetch

export const userTypeServices = {
    getUserTypes,
}

function getUserTypes() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/api/userTypes/getUserTypes', requestOptions)
            .then(response =>{
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting User Types")
            })
            .then(userTypes => {return userTypes})
            .catch(err => {console.log(err)})
}