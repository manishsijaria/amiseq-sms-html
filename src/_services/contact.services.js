
import 'whatwg-fetch' //in each file before using fetch


export const contactServices = {
    addContact
}

function addContact(contact) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(contact)
    }
    return fetch('/contacts/addContact', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in Adding Contact")
            })
            .then(contact => { return contact})
            .catch(err => {console.log(err)})    
}