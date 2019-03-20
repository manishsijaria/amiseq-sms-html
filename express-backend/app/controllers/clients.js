
var express = require('express')
var router = express.Router()

var clientsModel = require('../models/clients')

router.post('/addclient', (req, res) => {
    console.log('/clients/addclient post called');
    res.setHeader('Content-Type', 'application/json')
    clientsModel.addClient(req, (result,err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})

router.put('/editclient/:number', (req, res) => {
    console.log('/clients/editclient put called');
    console.log('number=' + req.params.number)
    res.setHeader('Content-Type', 'application/json')
    clientsModel.editClient(parseInt(req.params.number,10), req, (result,err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})
router.get('/getClients', (req, res) => {
    console.log('/clients/getClients called via get===')

    clientsModel.getClients((result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.delete('/delete', (req,res) => {
    console.log('/delete called via delete ===')
    //console.log(JSON.stringify(req.body))
    let clientArray  = JSON.parse(JSON.stringify(req.body))
    //console.log(JSON.stringify(clientArray))
    clientsModel.deleteClients(clientArray, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })    
})

//================ SMS requests ================
router.post('/smsall/:param', (req, res) => {
    const { smsText } = req.body
    console.log('/clients/smsall/' +  req.params.param + ' called via post')
    console.log('smsText=' + smsText)
    res.setHeader('Content-Type', 'application/json')
    clientsModel.smsAll(req.params.param, smsText, 
        (result, err) => {
            if(err) { 
                return res.status(404).json(JSON.stringify({msg:err})) 
            }
            else { return res.status(200).json(JSON.stringify(result)) }
    })
})

router.post('/smschecked/:param', (req, res) => {
    console.log('Here')
    const { smsText, clientArray } = req.body
    console.log('clientArray.length=' + clientArray.length)
    clientsModel.smsChecked(req.params.param, smsText, clientArray,
        (result,err) => {
            if(err) {
                return res.status(404).json(JSON.stringify({msg:err})) 
            }
            else { return res.status(200).json(JSON.stringify(result)) }
        })
})

router.get('/getClientMsgs/:number/:fetchText', (req, res) => {
    console.log('/clients/getClientMsgs called via get===')

    clientsModel.getClientMsgs(parseInt(req.params.number,10),req.params.fetchText, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.get('/getClientMsgsCount/:number/:fetchText', (req, res) => {
    console.log('/clients/getClientMsgsCount called via get===')
    console.log('fetchText=' + req.params.fetchText)
    clientsModel.getClientMsgsCount(parseInt(req.params.number,10),req.params.fetchText, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

module.exports = router