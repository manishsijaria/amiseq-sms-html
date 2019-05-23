-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema amiseq_sms_html
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema amiseq_sms_html
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `amiseq_sms_html` DEFAULT CHARACTER SET utf8 ;
USE `amiseq_sms_html` ;

-- -----------------------------------------------------
-- Table `amiseq_sms_html`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `amiseq_sms_html`.`user` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(100) NULL DEFAULT NULL,
  `lastname` VARCHAR(100) NULL DEFAULT NULL,
  `username` VARCHAR(100) NOT NULL COMMENT 'username should be unique for all users.',
  `password` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL COMMENT 'email should be unique.',
  `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `amiseq_sms_html`.`contact_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `amiseq_sms_html`.`contact_type` (
  `contact_type_id` INT(11) NOT NULL AUTO_INCREMENT,
  `type_name` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`contact_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `amiseq_sms_html`.`contact`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `amiseq_sms_html`.`contact` (
  `contact_id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(100) NULL DEFAULT NULL,
  `lastname` VARCHAR(100) NULL DEFAULT NULL,
  `mobile_no` VARCHAR(20) NULL DEFAULT NULL COMMENT 'mobile no should be unique for contacts.',
  `contact_type_id` INT(11) NOT NULL COMMENT 'Foreign key of contact_type, there can be more than one contact having the same contact_type_id.',
  `user_id` INT(11) NOT NULL COMMENT 'The user id of the user(recruiter) who created this contact.',
  `date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The date on which the contact is created.',
  `msg_count` INT(11) NULL DEFAULT 0 COMMENT 'This filed is updated by the trigger on message table(after row insert). Default value is 0.',
  `msg_date` DATETIME NULL DEFAULT NULL COMMENT 'This filed is updated by the trigger on message table(after row insert). Default\nNULL value of field.',
  PRIMARY KEY (`contact_id`),
  UNIQUE INDEX `mobile_no_UNIQUE` (`mobile_no` ASC),
  INDEX `fk_contacts_contact_type_idx` (`contact_type_id` ASC),
  INDEX `fk_contact_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_contact_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `amiseq_sms_html`.`user` (`user_id`),
  CONSTRAINT `fk_contacts_contact_type`
    FOREIGN KEY (`contact_type_id`)
    REFERENCES `amiseq_sms_html`.`contact_type` (`contact_type_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1585
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `amiseq_sms_html`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `amiseq_sms_html`.`message` (
  `message_id` INT(11) NOT NULL AUTO_INCREMENT,
  `msg_from` VARCHAR(20) NOT NULL,
  `msg_to` VARCHAR(20) NOT NULL,
  `msg_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sms_text` VARCHAR(1024) NOT NULL,
  `contact_id` INT(11) NOT NULL COMMENT 'one contact can have many messages. therefore (1..n) relationship between contact and message table.',
  `user_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  INDEX `fk_message_contact1_idx` (`contact_id` ASC),
  INDEX `fk_message_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_message_contact`
    FOREIGN KEY (`contact_id`)
    REFERENCES `amiseq_sms_html`.`contact` (`contact_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_message_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `amiseq_sms_html`.`user` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 232
DEFAULT CHARACTER SET = utf8;

USE `amiseq_sms_html` ;

-- -----------------------------------------------------
-- procedure insertIntoContact
-- -----------------------------------------------------

DELIMITER $$
USE `amiseq_sms_html`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertIntoContact`()
BEGIN
declare i int default 1;
	while (i < 1585) do 
		INSERT INTO `contact` (contact_id, firstname, lastname, mobile_no, contact_type_id, user_id, msg_count)
					values (i, 
                    CONCAT('firstname' , i), 
                    CONCAT('lastname' , i), 
                    CONCAT('+' , i), 1, 1, 0);
		set i = i + 1;
	end while;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insertIntoMessage
-- -----------------------------------------------------

DELIMITER $$
USE `amiseq_sms_html`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertIntoMessage`()
BEGIN
declare i int default 1;
declare textSMS varchar(1024) default '';
	while (i < 31) do 
		if (CHAR_LENGTH(textSMS) <= 160) THEN
			set textSMS = CONCAT( textSMS , ' Hello World ' , i);
        end if;
		
		INSERT INTO `message` (message_id, msg_from, msg_to, sms_text, contact_id, user_id)
					values (i, 
                    '+15005550006', 
                    '+14108675310', 
                    textSMS, 1, 1);
		set i = i + 1;
        SELECT SLEEP(1); /* sleep for 1 s*/
	end while;
END$$

DELIMITER ;
USE `amiseq_sms_html`;

DELIMITER $$
USE `amiseq_sms_html`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `amiseq_sms_html`.`after_message_insert`
AFTER INSERT ON `amiseq_sms_html`.`message`
FOR EACH ROW
BEGIN
    DECLARE id_exists Boolean;
    DECLARE AMISEQ_SMS_NO varchar(20) default '+15005550006';

    #Check the contact table
    SELECT 1 INTO id_exists
    FROM contact
    WHERE contact.contact_id = NEW.contact_id;

    IF id_exists = 1 THEN
	IF (STRCMP(NEW.msg_from, AMISEQ_SMS_NO) = 0) THEN #Amiseq send the message
	        UPDATE contact
        	SET msg_count = 0, msg_date = NOW()
		WHERE contact_id = NEW.contact_id;
	ELSE											  #Contact send the message
		UPDATE contact
        	SET msg_count = msg_count + 1, msg_date = NOW()
		WHERE contact_id = NEW.contact_id;		
	END IF;
    END IF;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
