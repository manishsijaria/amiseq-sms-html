
import 'whatwg-fetch' //in each file before using fetch

//for downloading the file (Resume) from the server.
var fileDownload = require('js-file-download');

export const candidateServices = {
    addCandidate,
    editCandidate,
    getCandidates,
    deleteCandidates,
    smsAll,
    smsChecked,
    getCandidateMsgs,
    getCandidateMsgsCount,
    downloadResume,
}

function addCandidate(candidate) {
    const requestOptions = {
        method: 'POST',
        //headers: { 'Content-Type' : 'application/json'},
        body: candidate
    }
    return fetch('/candidates/addcandidate', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in Adding Candidate")
            })
            .then(candidate => { return candidate})
            .catch(err => {console.log(err)})
}

function editCandidate(number, candidate) {
    const requestOptions = {
        method: 'PUT',
        //headers: { 'Content-Type' : 'application/json'},
        //body: JSON.stringify(candidate)
        body: candidate
    }
    return fetch('/candidates/editcandidate/' + number, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in updating candidate detail")
            })
            .then(candidate => {return candidate})
            .catch(err => { console.log(err)})    
}

function getCandidates() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }    
    return fetch('/candidates/getCandidates', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Candidates list")
            })
            .then(candidates => {return candidates})
            .catch(err => {console.log(err)})    
}

function deleteCandidates(candidateArray) {
    const requestOptions = {
        method: 'DELETE',
        headers: {  'Content-Type' : 'application/json' },
        body: JSON.stringify(candidateArray)
    }
    return fetch('/candidates/delete', requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in deleting Candidates ")
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
    return fetch('/candidates/smsall/' + param, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in SMS ALL Candidates")
            })
            .then(success => {return success})
            .catch(err => {console.log(err)})
}

function smsChecked(smsText, candidateArray) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({smsText: smsText , candidateArray: candidateArray })
    }
    //alert(JSON.stringify({smsText: smsText , clientArray: clientArray }))
    return fetch('/candidates/smschecked' , requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in SMS checked candidates")
            })
            .then(success => {return success})
            .catch(err => {console.log(err)})
}


//================ Candidate Messages =========================
function getCandidateMsgs(candidate_id, fetchText) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }

    return fetch('/candidates/getCandidateMsgs/' + candidate_id + '/' + fetchText, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Candidate Messages")
            })
            .then(candidateMsgs => {return candidateMsgs})
            .catch(err => {console.log(err)})
}

function getCandidateMsgsCount(candidate_id, fetchText) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type' : 'application/json'}
    }
    
    return fetch('/candidates/getCandidateMsgsCount/' + candidate_id + '/' + fetchText, requestOptions)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Error in getting Candidate Messages Count")
            })
            .then(msgsCount => {return parseInt(msgsCount,10)})
            .catch(err => {console.log(err)})    
}

function downloadResume(resume_filename) {
    const requestOptions = {
        method: 'GET',
    }
    //This fetches the response, reads it as a blob
    let filename = ''
    return fetch('/candidates/downloadResume/' + resume_filename, requestOptions)
            .then(response => {
                if(response.ok) {
                    let content = response.headers.get('Content-disposition')
                    filename = content.split(';')[1].split('filename')[1].split('=')[1].trim().replace(/"/g, '');
                    return response.blob();
                }
                throw new Error("Error in getting file")
            })
            .then(blob => { fileDownload(blob,filename)})
            .catch(err => {console.log(err)})
}