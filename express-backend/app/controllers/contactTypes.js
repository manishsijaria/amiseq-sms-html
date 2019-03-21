var express = require('express')
var router = express.Router()

var contactTypesModel = require('../models/contactTypes')

router.get('/getContactTypes', (req, res) => {
    console.log('/contactTypes/getContactTypes called via get===')

    contactTypesModel.getcontactTypes((result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

module.exports = router