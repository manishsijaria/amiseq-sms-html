var winston = require('../../config/winston');
var express = require('express')
var router = express.Router()

var receivesmsModel = require('../models/receivesms')

router.post('/twiliopost', (req, res) => {
    winston.log('info','/receivesms/twiliopost post called');
    //res.setHeader('Content-Type', 'application/json')
    receivesmsModel.twiliopost(req, req.app.get('socketio'), (result,err) => {
        res.writeHead(200, {'Content-Type' : 'text/xml'})
        if(err) {
            return res.end(err)
        } else {
            return res.end(result) 
        }
    })
})

module.exports = router