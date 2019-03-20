
var getConnection = require('../../config/dbconnection')
var modelsUtils = require('./modelsUtils')
var CONSTANTS = require('../../config/constants')
var multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file,cb)  { cb(null,'./resumes/') },
    filename: function(req, file, cb)  {
      cb(null, `${file.originalname}`);
    },
  });
const upload = multer({ storage }).single('resume');

const candidate_sql_queries = {
    CANDIDATES_ID : `SELECT candidate_id from candidate ORDER BY candidate_id`,
    CANDIDATES_MSGS: `SELECT msg_id, msg_from from candidate_msg WHERE ? ORDER BY msg_id desc`
}

module.exports.addCandidate = (req,res, callback) => {
    //console.log(req.file.originalname)
    upload(req,res, (err)=> {
        if(err) { 
            console.log(err)
        } else {
            //Note:- If req.file is not specified(not set), no error is generated.
            //       If the file is existing and again uploaded, no error is generated.
            let originalfilename = (req.file === undefined) ? '' : req.file.originalname
            console.log(req.body.candidate)
            let {  firstname,lastname,mobile_no,notes, phone,
                email,birthdate,gender,ssn,
                address,country,state,city,
                zip,hiredate,client_id, fullname, company_name, for_company } = JSON.parse(req.body.candidate)
            //if '' is inserted in date field 0000-00-00 is inserted in date column.
            //therefore null is inserted through this function.
            birthdate = modelsUtils.handelNullField(birthdate)  
            hiredate = modelsUtils.handelNullField(hiredate)
            //similarily for client_id foreign key, '' can't be inseretd, we need to send null
            client_id = modelsUtils.handelNullField(client_id)

            console.log('originalfilename=' + originalfilename)
            //prepare insert query, with client_id
            var insert_query = `INSERT INTO candidate(firstname,lastname,mobile_no,
                notes,phone,
                email,birthdate,gender,ssn,
                address,country,state,city,
                zip,hiredate,client_id,resume_filename) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`  
                getConnection((err,connection)=> {
                    connection.query(insert_query,
                                    [firstname,lastname,mobile_no,notes, phone,
                                        email,birthdate,gender,ssn,
                                        address,country,state,city,
                                        zip,hiredate,client_id,originalfilename],
                                    function(err,result) {
                                        connection.release()
                                        if(err) {
                                            callback(null, err)
                                            console.log('error in inserting user' + err);                                
                                        } else {
                                            //NOTE: The response must be a JSON string, so that it is caught on the react-client properly.
                                            //      Otherwise Err: net::ERR_EMPTY_RESPONSE TypeError: Failed to fetch  occures.
                                            var success_msg = 'Insert Successful id=' + result.insertId;
                                            console.log('insert successful : ' + success_msg);
                                            callback({ candidate_id: result.insertId, firstname: firstname, lastname: lastname,mobile_no: mobile_no, 
                                                        notes:notes, phone: phone,
                                                        email: email, birthdate: birthdate, gender: gender, ssn: ssn,
                                                        address: address, country: country, state: state, city: city,
                                                        zip: zip, hiredate: hiredate, client_id: client_id, fullname: fullname, 
                                                        company_name: company_name, resume_filename:originalfilename  }, null)                           
                                        }
                                    })
                })            
        }
    })      
}
//module.exports.editCandidate = (number, req, callback) => {
module.exports.editCandidate = (number, req,res, callback) => {
    //Check if the candidate has resume_filename and is not null.
    //Delete the file from ./resumes/ folder.
   
    let select_query = `Select resume_filename from candidate WHERE candidate_id=` + number
    upload(req,res, (err)=> {
        if(err) { 
            console.log(err)
        } else {
            console.log('Hello')
            //Note:- If req.file is not specified(not set), no error is generated.
            //       If the file is existing and again uploaded, no error is generated.
            let new_filename = (req.file === undefined) ? '' : req.file.originalname
            console.log(req.body.candidate)
            let {  firstname,lastname,mobile_no,notes, phone,
                email,birthdate,gender,ssn,
                address,country,state,city,
                zip,hiredate,client_id, fullname, company_name,resume_filename } = JSON.parse(req.body.candidate)
                //console.log('resume_filename=' + resume_filename)
            getConnection((err,connection) => {
                connection.query(select_query,[], function(err, result){
                    connection.release()
                    if(err) { callback(null,err); console.log(err) }
                    else {
                        let candidateArr = JSON.parse(JSON.stringify(result))
                        console.log('new_filename=' + new_filename + ' resume_filename=' + resume_filename)
                        if(candidateArr[0].resume_filename !== '' && candidateArr[0].resume_filename !== new_filename)  {
                            modelsUtils.deleteResume(candidateArr[0].resume_filename)
                        }


                        //Update now
                        var update_query = `UPDATE candidate SET ? WHERE ?`
                        condition = {candidate_id: number}
                        //req.body
                        birthdate = modelsUtils.handelNullField(birthdate)
                        hiredate = modelsUtils.handelNullField(hiredate)  
                        client_id = modelsUtils.handelNullField(client_id)

                        getConnection((err,connection)=> {
                            connection.query(update_query,[{  firstname,lastname,mobile_no,
                                                            notes, phone,
                                                            email,birthdate,gender,ssn,
                                                            address,country,state,city,
                                                            zip,hiredate,client_id,resume_filename },condition],
                                                            function(err,result)  {
                                                                connection.release()
                                                                if(err) {
                                                                    callback(null,err)
                                                                    console.log('error in update ' + err)
                                                                } else {
                                                                    var success_msg = 'Update Successful id=' + condition.candidate_id
                                                                    console.log(success_msg)
                                                                    callback({ candidate_id: condition.candidate_id, firstname: firstname, lastname: lastname,mobile_no: mobile_no, 
                                                                        notes:notes, phone: phone,
                                                                        email: email, birthdate: birthdate, gender: gender, ssn: ssn,
                                                                        address: address, country: country, state: state, city: city,
                                                                        zip: zip, hiredate: hiredate, client_id: client_id,fullname: fullname,company_name:company_name,resume_filename:resume_filename }, null) 
                                                                }
                                                            }
                            )
                        })                

                    }   
                }) 
            })
        }
    })
}
//Pass client_id as null to fetch all candidates, else pass client_id.
module.exports.getCandidates = (callback) => {
    let queryCandidates = `select 	candidate.candidate_id, candidate.firstname, candidate.lastname,
                            candidate.mobile_no, candidate.notes, candidate.client_id,	candidate.phone ,
                            candidate.email , candidate.gender, candidate.ssn ,candidate.address ,
                            candidate.country ,candidate.state ,candidate.city ,candidate.zip, 
                            CONCAT(candidate.firstname,' ', candidate.lastname) as fullname, 
                            DATE_FORMAT(hiredate,"%Y-%m-%d") as hiredate, 
                            DATE_FORMAT(birthdate,"%Y-%m-%d") as birthdate, 
                            candidate.resume_filename,
                            client.company_name
                        from candidate
                        left join client on candidate.client_id=client.client_id`
    
    console.log("Query: " + queryCandidates)
    getConnection((err,connection)=> {
        connection.query(queryCandidates, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Candidates list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }

        })
    })    
}

module.exports.deleteCandidates = (candidateArray , callback) => {

    var deleteCandidates = `DELETE FROM candidate WHERE candidate.candidate_id IN (` + candidateArray.join(',') + `)`
    getConnection((err,connection)=> {
        //While deleting candidates delete there resumes.
        modelsUtils.deleteCandidatesResumes(candidateArray,connection)
        connection.query(deleteCandidates, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in deleting Candidates')
            } else {
                callback(result,null)
                console.log('result.length=' + JSON.stringify(result.length))
                console.log('result=' + JSON.stringify(result))
            }

        })
    })    
}

module.exports.smsAll = (param, smsText, callback) => {
    let bWithAmiseq 
    if(param === 'undefined' || typeof(param) === 'undefined') {
        console.log('smsAll candidates')
        bWithAmiseq = false
    } else {
        console.log('smsAll candidates with Amiseq Inc. ' + param)
        bWithAmiseq = true
    }
    this.getCandidates((result,err)=> {
        if(err) { console.log(err) }
        else {
            let candidateList = JSON.parse(JSON.stringify(result))
            getConnection((err, connection) => {
                modelsUtils.sendMsgToCandidates(smsText, candidateList, connection, bWithAmiseq)
                connection.release()
            })
        }

    })
    callback({msg: 'success'}, null)
}

module.exports.smsChecked = (smsText, candidateArray, callback) => {
    let select_query = `SELECT candidate_id, mobile_no from candidate `
    select_query = select_query + `WHERE candidate_id IN(` + candidateArray.join(',') + `)`
    console.log(select_query)
    //get the connection
    getConnection((err,connection)=> { 
        //get the mobile no's for the candidate_id in candidateArray.
        connection.query(select_query,[],(err,result) => {
            if(err) { console.log(err) }
            else {
                //got the result of select
                let candidateList = JSON.parse(JSON.stringify(result))
                //call the function to send message to candidates.
                modelsUtils.sendMsgToCandidates(smsText, candidateList, connection, false)
            }
        })
        connection.release()
    })
    callback({msg: 'success'}, null)    
}

module.exports.getCandidateMsgs = (candidate_id,fetchText, callback) => {
    var queryCandidateMsgs = `SELECT DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date ,msg_from,msg_to, sms_text 
                                  FROM 
                                  candidate_msg WHERE candidate_id=` + candidate_id 
    let whereDateCondition = ''
    switch (fetchText) {
        case 'ALL':
            break;
        case '1_YEAR':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 365 DAY)`
            break;
        case '6_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 180 DAY)`
            break;
        case '3_MONTHS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 90 DAY)`
            break;
        case '1_MONTH':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 30 DAY)`
            break;
        case '15_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 15 DAY)`
            break;
        case '7_DAYS':
            whereDateCondition = `msg_date > (NOW() - INTERVAL 7 DAY)`
            break;
    }
    var caluseOrderBy =  ` ORDER BY msg_date asc`
    if(whereDateCondition !== '') {
        queryCandidateMsgs = queryCandidateMsgs + ` AND ` + whereDateCondition + caluseOrderBy
    } else {
        queryCandidateMsgs = queryCandidateMsgs + caluseOrderBy
    }
                                                                
    getConnection((err,connection)=> {
        connection.query(queryCandidateMsgs, [], (err, result) => {
            connection.release()
            if(err) {
                callback(null,err)
                console.log('Error in getting Candidate Msgs list')
            } else {
                callback(result,null)
                console.log(JSON.stringify(result.length))
                console.log(JSON.stringify(result))
            }
        })
    })    
}

module.exports.getCandidateMsgsCount = (candidate_id,fetchText, callback) => {
    var queryCandidateMsgsCount = `SELECT count(*) as msgsCount 
                             FROM 
                             candidate_msg WHERE candidate_id=` + candidate_id 
     //console.log('fetchText=' + fetchText)
     let whereDateCondition = ''
     switch (fetchText) {
         case 'ALL':
             break;
         case '1_YEAR':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 365 DAY)`
             break;
         case '6_MONTHS':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 180 DAY)`
             break;
         case '3_MONTHS':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 90 DAY)`
             break;
         case '1_MONTH':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 30 DAY)`
             break;
         case '15_DAYS':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 15 DAY)`
             break;
         case '7_DAYS':
             whereDateCondition = `msg_date > (NOW() - INTERVAL 7 DAY)`
             break;
     }
     if(whereDateCondition !== '') {
        queryCandidateMsgsCount = queryCandidateMsgsCount + ` AND ` + whereDateCondition
     }
     console.log('queryCandidateMsgsCount=' + queryCandidateMsgsCount)
     getConnection((err,connection)=> {
         connection.query(queryCandidateMsgsCount, [], (err, result) => {
             connection.release()
             if(err) {
                 callback(null,err)
                 console.log('Error in getting Candidate Msgs Count')
             } else {
                 callback(result[0].msgsCount,null)
                 console.log(JSON.stringify(result.length))
                 console.log(JSON.stringify(result))
             }
         })
     })        
 }

 module.exports.candidates_msg_count_array = (cb) => {
    var arr_candidates_msg_count = []
    getConnection((err,connection)=> { 
        connection.query(candidate_sql_queries.CANDIDATES_ID,[],(err,result) => {
            if(!err) {
                if(result.length) {
                    console.log("result.length=" + result.length)
                    for(let i=0; i < result.length; i++) {
                        condition = {candidate_id: result[i].candidate_id}
                        connection.query(candidate_sql_queries.CANDIDATES_MSGS,[condition], 
                            function(err,result_inner)  {
                             if(!err) {
                                 let count = 0
                                 if(result_inner.length) {
                                    for(let j=0; j< result_inner.length; j++) {
                                        if(result_inner[j].msg_from !== CONSTANTS.TWILIO_AMISEQ_NO) {
                                            count++
                                        } else {
                                            break  //exit the for loop, no message at the top
                                        }
                                    }
                                 }
                                 arr_candidates_msg_count.push({candidate_id: result[i].candidate_id, msg_count: count })
                                 if(i=== result.length -1) { //fix for closers
                                    connection.release();
                                    cb(arr_candidates_msg_count)                
                                 }
                             }   
                        })
                    }
                }
            }
        })
    })   
}