


CREATE PROCEDURE `insertIntoContact` ()

BEGIN
declare i int default 1;
	while (i < 1585) do 
		INSERT INTO `contact` (contact_id, firstname, lastname, mobile_no, contact_type_id, user_id, msg_count)
					values (i, `firstname` + i, `lastname` + i, `+` + i, 1, 1, 0);
		set i = i + 1;
	end while;
END



