var express = require('express')
var router = express.Router()

var contactsModel = require('../models/contacts')

router.post('/addContact', (req, res) => {
    console.log('/contacts/addContact post called');
    res.setHeader('Content-Type', 'application/json')
    contactsModel.addContact(req, (result,err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})

router.delete('/delete', (req,res) => {
    console.log('/delete called via delete ===')
    //console.log(JSON.stringify(req.body))
    let { contact_id }  = JSON.parse(JSON.stringify(req.body))
    //console.log(JSON.stringify(clientArray))
    contactsModel.deleteContact(contact_id, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })    
})

router.get('/getContacts/:offset/:count', (req, res) => {
    console.log('/contacts/getContacts called via get===')

    contactsModel.getContacts(parseInt(req.params.offset,10),
                              parseInt(req.params.count,10),       
                              (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.get('/getContactsCount', (req, res) => {
    console.log('/contacts/getContactsCount called via get===')

    contactsModel.getContactsCount((result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})



module.exports = router