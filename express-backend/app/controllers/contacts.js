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

module.exports = router