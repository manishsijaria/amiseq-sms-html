insert into contact_type (contact_type_id, type_name) 
values (1, 'Candidate'), (2, 'Client'), (3, 'Others');


Offset: It is used to specify the offset of the first row to be returned.
		if offset=100 and the first row=1 than select would return 101st record.
Count:It is used to specify the maximum number of rows to be returned.

SELECT *
FROM contact
LIMIT Offset, Count;

SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
                                mobile_no, contact_type_id, user_id, msg_count FROM
                            contact  ORDER BY msg_count desc, contact_id asc, fullname asc LIMIT 0, 20;

select count(*) from contact;

SELECT contact_id, CONCAT(firstname,' ', lastname) as fullname,
                                mobile_no, contact_type_id, user_id, msg_count FROM
                            contact WHERE CONCAT(firstname,' ', lastname) like '%2%' ORDER BY msg_count desc, contact_id asc, fullname asc LIMIT 41,20;