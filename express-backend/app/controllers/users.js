

var express = require('express')
var router = express.Router();
var usersModel = require('../models/users')
                                          
router.post('/authenticate', (req,res) => {
    console.log('/authenticate post called');
    //console.log('username:' + req.body.username)
    //console.log('password:' + req.body.password)
    res.setHeader('Content-Type', 'application/json');
    usersModel.authenticate(req, (result, err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
    
})

router.post('/register', (req,res) => {
    console.log('/register post called');
    //console.log('username:' + req.body.username)
    //console.log('password:' + req.body.password)
    res.setHeader('Content-Type', 'application/json');

    usersModel.register(req, (result, err) => {
        if(err) {
            return res.status(404).json(JSON.stringify({msg:err}))
        } else {
            return res.status(200).json(JSON.stringify(result)) 
        }
    })
})

router.post('/smsSend', (req, res) => {
    console.log('Here')
    const {user_id, smsText, contactArray } = req.body
    console.log('contactArray.length=' + contactArray.length)
    usersModel.smsSend(user_id,smsText, contactArray,
        (result,err) => {
            if(err) {
                return res.status(404).json(JSON.stringify({msg:err})) 
            }
            else { return res.status(200).json(JSON.stringify(result)) }
        })
})


module.exports = router;