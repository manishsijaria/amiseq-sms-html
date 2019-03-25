
import 'whatwg-fetch' //in each file before using fetch


export const contactServices = {
    addContact,
    getContacts,
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

function getContacts(user_id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/contacts/getContacts/' + user_id , requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Contacts List")
            })
            .then(contacts => {return contacts})
            .catch(err => {console.log(err)})
}
