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

router.post('/getContacts/:offset/:count', (req, res) => {
    console.log('/contacts/getContacts called via post===')
    const { filterText } = req.body

    contactsModel.getContacts(parseInt(req.params.offset,10),
                              parseInt(req.params.count,10),
                              filterText,       
                              (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.post('/getContactsCount', (req, res) => {
    console.log('/contacts/getContactsCount called via post===')
    const { filterText } = req.body
    console.log('filterText=' + filterText)
    contactsModel.getContactsCount(filterText, (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.get('/getMsgsCount/:number', (req, res) => {
    console.log('/contacts/getMsgsCount called via get===')
    
    contactsModel.getMsgsCount(parseInt(req.params.number,10), (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

router.get('/getContactMsgs/:offset/:count/:contact_id', (req, res) => {
    console.log('/contacts/getContactMsgs called via get===')

    contactsModel.getContactMsgs(parseInt(req.params.offset,10),
                                 parseInt(req.params.count,10),
                                 parseInt(req.params.contact_id,10), 
                                (result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
})

module.exports = router