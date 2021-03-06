var getConnection = require('../../config/dbconnection')
var winston = require('../../config/winston');
var modelsUtils = require('./modelsUtils')

module.exports.authenticate = (req, callback) => {
    var getUsersByUsernamePassword = 'select * from user where username=? and password=?'
    getConnection((err,connection)=> {
        connection.query(getUsersByUsernamePassword,[req.body.username,req.body.password],(err,result) => {
            connection.release()
            if(err) {
                callback(null,err)
                winston.log('error','Error during logging' + err)                              
            } else {
                if(result.length) {
                    winston.log('info','Login success !!')
                    callback({user_id: result[0].user_id,
                            username: req.body.username, 
                            password: req.body.password},null)
                    
                } else {
                    err = 'invalid credentials'
                    winston.log('error',err)
                    callback(null,err)
                }
            }
        })
    })                 
}

module.exports.register = (req, callback) => {
   //prepare the insert query.
   var insert_query = 'INSERT INTO user(user_type_id, email, firstname, lastname, username, password) VALUES (?,?,?,?,?,?)';
   //execute the query.
   getConnection((err,connection)=> {
       connection.query(insert_query,
                       [req.body.user_type_id, req.body.email,req.body.firstname,req.body.lastname,req.body.username, req.body.password],
                       function(err, result) {
           connection.release();
           if(err) {
                winston.log('error','error in inserting user' + err);
                callback(null,err)               
           } else {
                var success_msg = 'Insert Successful id=' + result.insertId;
                winston.log('info','insert successful : ' + success_msg);
                callback({username: req.body.username, 
                            password: req.body.password},null)
               
           }
       })
   })    
}

module.exports.smsSend = (user_id, smsText, contactArray,io, callback) => {
    let getContacts = `SELECT contact_id, mobile_no from contact `
    getContacts = getContacts + `WHERE contact_id IN(` + contactArray.join(',') + `)`
    console.log(getContacts)
    //get the connection
    getConnection((err,connection)=> { 
        //get the mobile no's for the client_id in clientArray.
        connection.query(getContacts,[],(err,result) => {
            if(err) { console.log(err) }
            else {
                //got the result of select
                let contactList = JSON.parse(JSON.stringify(result))
                //call the function to send message to client.
                modelsUtils.sendMsgToContacts(user_id, smsText, contactList, connection, io)
            }
        })
        connection.release()
    })
    callback({msg: 'success'}, null)
}