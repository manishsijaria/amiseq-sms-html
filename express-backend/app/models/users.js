var getConnection = require('../../config/dbconnection')
var modelsUtils = require('./modelsUtils')

module.exports.authenticate = (req, callback) => {
    var getUsersByUsernamePassword = 'select * from user where username=? and password=?'
    getConnection((err,connection)=> {
        connection.query(getUsersByUsernamePassword,[req.body.username,req.body.password],(error,result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error during logging' + err)                              
            } else {
                if(result.length) {
                    console.log('Login success !!')
                    callback({username: req.body.username, 
                            password: req.body.password},null)
                    
                } else {
                    var err = 'invalid credentials'
                    console.log(err)
                    callback(null,err)
                }
            }
        })
    })                 
}

module.exports.register = (req, callback) => {
   //prepare the insert query.
   var insert_query = 'INSERT INTO user(email, firstname, lastname, username, password) VALUES (?,?,?,?,?)';
   //execute the query.
   getConnection((err,connection)=> {
       connection.query(insert_query,
                       [req.body.email,req.body.firstname,req.body.lastname,req.body.username, req.body.password],
                       function(err, result) {
           connection.release();
           if(err) {
                console.log('error in inserting user' + err);
                callback(null,err)               
           } else {
                var success_msg = 'Insert Successful id=' + result.insertId;
                console.log('insert successful : ' + success_msg);
                callback({username: req.body.username, 
                            password: req.body.password},null)
               
           }
       })
   })    
}