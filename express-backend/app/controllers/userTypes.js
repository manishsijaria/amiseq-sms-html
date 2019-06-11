var winston = require('../../config/winston');
var express = require('express')
var router = express.Router()

var userTypesModel = require('../models/userTypes')

router.get('/getUserTypes', (req, res) => {
    winston.log('info','/userTypes/getUserTypes called via get')

    userTypesModel.getUserTypes((result,err) => {
        if(err) { 
            return res.status(404).json(JSON.stringify({msg:err})) 
        }
        else { return res.status(200).json(JSON.stringify(result)) }        
    })
   
})

module.exports = router