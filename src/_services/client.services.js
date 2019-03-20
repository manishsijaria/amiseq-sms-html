
import 'whatwg-fetch' //in each file before using fetch

export const clientServices = {
    addClient,
    editClient,
    getClients,
    deleteClients,
    smsAll,
    smsChecked,
    getClientMsgs,
    getClientMsgsCount,
}

function addClient(client) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(client)
    }
    return fetch('/clients/addclient', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in Adding Client")
            })
            .then(client => { return client})
            .catch(err => {console.log(err)})
}

function editClient(number, client) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify(client)
    }
    return fetch('/clients/editclient/' + number, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in updating client detail")
            })
            .then(client => {return client})
            .catch(err => { console.log(err)})

}
function getClients() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/clients/getClients', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Clients list")
            })
            .then(clients => {return clients})
            .catch(err => {console.log(err)})
}

function deleteClients(clientArray) {
    const requestOptions = {
        method: 'DELETE',
        headers: {  'Content-Type' : 'application/json' },
        body: JSON.stringify(clientArray)
    }
    return fetch('/clients/delete', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in deleting Clients ")
            })
            .then(successMsg => {return successMsg})
            .catch(err => { console.log(err) })
}

//================== SMS Services ===============
function smsAll(param, smsText) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({smsText: smsText})
    }
    return fetch('/clients/smsall/' + param, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in SMS ALL Clients")
            })
            .then(success => {return success})
            .catch(err => {console.log(err)})
}

function smsChecked(param,smsText, clientArray) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({smsText: smsText , clientArray: clientArray })
    }
    //alert(JSON.stringify({smsText: smsText , clientArray: clientArray }))
    return fetch('/clients/smschecked/' + param, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in SMS checked clients")
            })
            .then(success => {return success})
            .catch(err => {console.log(err)})
}

//================ Client Messages =========================
function getClientMsgs(client_id, fetchText) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    return fetch('/clients/getClientMsgs/' + client_id + '/' + fetchText, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Clients Messages")
            })
            .then(clientMsgs => {return clientMsgs})
            .catch(err => {console.log(err)})
}

function getClientMsgsCount(client_id, fetchText) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    
    return fetch('/clients/getClientMsgsCount/' + client_id + '/' + fetchText, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Clients Messages Count")
            })
            .then(msgsCount => {return parseInt(msgsCount,10)})
            .catch(err => {console.log(err)})    
}