
/*================== Populate DB Script ==================*/
insert into contact_type (contact_type_id, type_name) 
values (1, 'Candidate'), (2, 'Client'), (3, 'Others');

/* add user manish manish from application */
select * from user;
delete from user;
update user set user_id =1 where user_id = 2;
                            
CALL `amiseq_sms_html`.`insertIntoContact`();
select * from contact;

delete from message;
CALL `amiseq_sms_html`.`insertIntoMessage`();
select * from message;
update contact SET mobile_no = '+14108675310' where contact_id = 1;

/* ======================================================*/

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
                                                             where message.contact_id=1 
UNION ALL  SELECT message_id, msg_date, DATE_FORMAT(msg_date,"%b %d, %Y %l:%i %p") as message_date ,
                            msg_from, msg_to, sms_text, contact_id,
                            message.user_id, CONCAT(user.firstname,' ', user.lastname) as fullname
                    FROM message right outer join user on message.user_id=user.user_id
                                                          where message.contact_id=1 and message.user_id is null  
ORDER BY msg_date desc LIMIT 0,1;

/* =============== */
select * from user;

select * from message;

select * from contact where contact_id =1;
/* ============================================================= */
DELIMITER $$
CREATE TRIGGER after_message_insert
AFTER INSERT ON message FOR EACH ROW 
BEGIN
    DECLARE id_exists Boolean;
    DECLARE AMISEQ_SMS_NO varchar(20) default '+15005550006';

    #Check the contact table whether the contact_id exists in contact table.
    SELECT 1 INTO id_exists
    FROM contact
    WHERE contact.contact_id = NEW.contact_id;

    IF id_exists = 1 THEN
		IF (STRCMP(NEW.msg_from, AMISEQ_SMS_NO) = 0) THEN #Amiseq send the message
				UPDATE contact
				SET msg_count = 0
			WHERE contact_id = NEW.contact_id;
		ELSE											  #Contact send the message
			UPDATE contact
				SET msg_count = msg_count + 1
			WHERE contact_id = NEW.contact_id;		
		END IF;
    END IF;
END;
$$
DELIMITER ;


