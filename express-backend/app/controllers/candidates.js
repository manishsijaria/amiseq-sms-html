
var express = require('express')
var router = express.Router()

var candidatesModel = require('../models/candidates')
const path = require('path')

router.post('/addcandidate', (req, res) => {
    console.log('/addcandidate post called');
    res.setHeader('Content-Type', 'application/json')
    candidatesModel.addCandidate(req,res,(result,err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})
router.put('/editcandidate/:number', (req, res) => {
    console.log('/candidates/editcandidate put called');
    console.log('number=' + req.params.number)
    res.setHeader('Content-Type', 'application/json')
    //candidatesModel.editCandidate(parseInt(req.params.number,10), req, (result,err) => {
    candidatesModel.editCandidate(parseInt(req.params.number,10), req, res, (result,err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})
router.get('/getCandidates', (req, res) => {
    console.log('/candidates/getCandidates called via get===')

    candidatesModel.getCandidates((result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.delete('/delete', (req,res) => {
    console.log('/delete called via delete ===')
    //console.log(JSON.stringify(req.body))
    let candidateArray  = JSON.parse(JSON.stringify(req.body))
    //console.log(JSON.stringify(clientArray))
    candidatesModel.deleteCandidates(candidateArray, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })    
})

//================ SMS requests ================
router.post('/smsall/:param?', (req, res) => {
    const { smsText } = req.body
    //console.log('Hello')
    console.log('/candidates/smsall/' +  req.params.param + ' called via post')
    console.log('smsText=' + smsText)
    res.setHeader('Content-Type', 'application/json')
    candidatesModel.smsAll(req.params.param, smsText, 
        (result, err) => {
            if(err) { 
                return res.status(404).json(JSON.stringify({msg:err})) 
            }
            else { return res.status(200).json(JSON.stringify(result)) }
    })
})

router.post('/smschecked', (req, res) => {
    console.log('Here')
    const { smsText, candidateArray } = req.body
    console.log('candidateArray.length=' + candidateArray.length)
    candidatesModel.smsChecked(smsText, candidateArray,
        (result,err) => {
            if(err) {
                return res.status(404).json(JSON.stringify({msg:err})) 
            }
            else { return res.status(200).json(JSON.stringify(result)) }
        })
})

router.get('/getCandidateMsgs/:number/:fetchText', (req, res) => {
    console.log('/candidates/getCandiateMsgs called via get===')

    candidatesModel.getCandidateMsgs(parseInt(req.params.number,10),req.params.fetchText, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})
router.get('/getCandidateMsgsCount/:number/:fetchText', (req, res) => {
    console.log('/candidates/getCandidateMsgsCount called via get===')
    console.log('fetchText=' + req.params.fetchText)
    candidatesModel.getCandidateMsgsCount(parseInt(req.params.number,10),req.params.fetchText, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.get('/downloadResume/:resume_filename', (req, res)=> {
    console.log('/candidates/downloadResume called via get ===')
    console.log(req.params.resume_filename)
    var filePath =  '.' + path.sep + 'resumes' + path.sep + req.params.resume_filename
    console.log(filePath)
    res.status(200).download(filePath,req.params.resume_filename)
})

module.exports = router