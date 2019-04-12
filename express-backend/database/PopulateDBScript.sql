insert into contact_type (contact_type_id, type_name) 
values (1, 'Candidate'), (2, 'Client'), (3, 'Others');

/*
Offset: It is used to specify the offset of the first row to be returned.
		if offset=100 and the first row=1 than select would return 101st record.
Count:It is used to specify the maximum number of rows to be returned.
*/

/* Get contact order by msg_count desc*/
SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
		mobile_no, contact_type_id, user_id, msg_count 
FROM contact  
ORDER BY msg_count desc, contact_id asc, fullname asc LIMIT 0, 20;

/* Get contact with fullname like param, order by msg_count desc*/
SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
		mobile_no, contact_type_id, user_id, msg_count 
FROM contact 
WHERE CONCAT(firstname,' ', lastname) like '%2%' 
ORDER BY msg_count desc, contact_id asc, fullname asc LIMIT 41,20;
                            
CALL `amiseq_sms_html`.`insertIntoContact`();
CALL `amiseq_sms_html`.`insertIntoMessage`();

/* if the message is received from a contact, than the user_id would be null*/
update message set user_id = null where message_id = 2;

/*Get all the message's, user fullname, even if the user_id=NULL in message table.
  This will happen when the contact sends message to sms system.
  StackOverflow question:
  https://stackoverflow.com/questions/55651051/query-needed-to-retrive-all-the-rows-from-one-table-joined-with-other-table
*/
SELECT message_id,msg_date, DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date , 
          msg_from, msg_to, sms_text, contact_id, 
       message.user_id,  CONCAT(user.firstname,' ', user.lastname) as fullname   
FROM message left outer join user on message.user_id=user.user_id 
                               and message.contact_id=1
UNION ALL
 SELECT message_id, msg_date, DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date , 
         msg_from, msg_to, sms_text, contact_id, 
       message.user_id, CONCAT(user.firstname,' ', user.lastname) as fullname    
FROM message right outer join user on message.user_id=user.user_id 
								and message.contact_id=1
                                and message.user_id is null
order by msg_date desc;

