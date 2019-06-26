
import 'whatwg-fetch' //in each file before using fetch


export const contactServices = {
    addContact,
    deleteContact,
    getContacts,
    getContactsCount,
    getMsgsCount,
    getContactMsgs,
}

function addContact(contact) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(contact)
    }
    return fetch('/api/contacts/addContact', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in Adding Contact")
            })
            .then(contact => { return contact})
            .catch(err => {console.log(err)})    
}

function deleteContact(contact_id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {  'Content-Type' : 'application/json' },
        body: JSON.stringify({contact_id: contact_id})
    }
    return fetch('/api/contacts/delete', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in deleting contact ")
            })
            .then(successMsg => {return successMsg})
            .catch(err => { console.log(err) })
}

function getContacts(offset, count, filterText) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({filterText: filterText})
    }
    return fetch('/api/contacts/getContacts/' + offset + '/' + count , requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Contacts List")
            })
            .then(contacts => {return contacts})
            .catch(err => {console.log(err)})
}

function getContactsCount(filterText) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({filterText: filterText})
    }
    
    return fetch('/api/contacts/getContactsCount', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting contacts count")
            })
            .then(count => {  return parseInt(count,10)})
            .catch(err => {console.log(err)})    
}

function getMsgsCount(contact_id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    
    return fetch('/api/contacts/getMsgsCount/'   + contact_id , requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Contact Messages Count")
            })
            .then(count => {return parseInt(count,10)})
            .catch(err => {console.log(err)})     
}

function getContactMsgs(offset, count, contact_id) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/api/contacts/getContactMsgs/' + offset + '/' + count + '/' + contact_id, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Clients Messages")
            })
            .then(contactMsgs => {return contactMsgs})
            .catch(err => {console.log(err)})    
}