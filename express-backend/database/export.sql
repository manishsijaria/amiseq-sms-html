-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: amiseq_sms_html
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `contact` (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `mobile_no` varchar(20) DEFAULT NULL COMMENT 'mobile no should be unique for contacts.',
  `contact_type_id` int(11) NOT NULL COMMENT 'Foreign key of contact_type, there can be more than one contact having the same contact_type_id.',
  `user_id` int(11) NOT NULL,
  `msg_count` int(11) DEFAULT '0',
  PRIMARY KEY (`contact_id`),
  UNIQUE KEY `mobile_no_UNIQUE` (`mobile_no`),
  KEY `fk_contacts_contact_type_idx` (`contact_type_id`),
  KEY `fk_contact_user1_idx` (`user_id`),
  CONSTRAINT `fk_contact_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `fk_contacts_contact_type` FOREIGN KEY (`contact_type_id`) REFERENCES `contact_type` (`contact_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,'Rahul','Dubey','+14108675310',1,1,0),(2,'Raja','Jani','+1999999999',1,1,0),(3,'Mehul','Choukse','+1894736365',1,1,0),(4,'Nerav','Modi','+19847674885',1,1,0),(5,'Vijay','Malya','+17564557584',1,1,0),(6,'Ankit','Roy','+15673636366',1,1,0),(7,'Garv','Gangawala','+1453245423',1,1,0),(8,'Rahul','Roy','+1564736252',1,1,0),(12,'Shailesh','Joshi','+1894736367',1,1,0),(14,'Nirman','Datta','+19847674887',1,1,0),(16,'Sonum','Mathur','+17564557586',1,1,0),(17,'U','anup','+15673636364',1,1,0),(24,'Test','Dubey','+15673636362',1,1,0),(25,'Test','Dubey','+15005550006',1,1,0),(28,'Test','Dubey','+15673636445',1,1,0),(29,'Test','Panchal','+1454545453',1,1,0);
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_type`
--

DROP TABLE IF EXISTS `contact_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `contact_type` (
  `contact_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`contact_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_type`
--

LOCK TABLES `contact_type` WRITE;
/*!40000 ALTER TABLE `contact_type` DISABLE KEYS */;
INSERT INTO `contact_type` VALUES (1,'Candidate'),(2,'Client'),(3,'Others');
/*!40000 ALTER TABLE `contact_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `msg_from` varchar(20) NOT NULL,
  `msg_to` varchar(20) NOT NULL,
  `msg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sms_text` varchar(1024) NOT NULL,
  `contact_id` int(11) NOT NULL COMMENT 'one contact can have many messages. therefore (1..n) relationship between contact and message table.',
  PRIMARY KEY (`message_id`),
  KEY `fk_message_contact1_idx` (`contact_id`),
  CONSTRAINT `fk_message_contact` FOREIGN KEY (`contact_id`) REFERENCES `contact` (`contact_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `username` varchar(100) NOT NULL COMMENT 'username should be unique for all users.',
  `password` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL COMMENT 'email should be unique.',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Manish','Sijaria','manish','manish','manish@amiseq.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-27 22:18:12
