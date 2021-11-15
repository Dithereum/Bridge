-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: dithereumbacked
-- ------------------------------------------------------
-- Server version	5.7.36-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `COMMISSION_VIEW`
--

DROP TABLE IF EXISTS `COMMISSION_VIEW`;
/*!50001 DROP VIEW IF EXISTS `COMMISSION_VIEW`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `COMMISSION_VIEW` AS SELECT 
 1 AS `total_deployer_commission`,
 1 AS `deployer_addr`,
 1 AS `total_referrer_commission`,
 1 AS `referrer_addr`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `LastBlock`
--

DROP TABLE IF EXISTS `LastBlock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LastBlock` (
  `blockid` bigint(20) NOT NULL,
  PRIMARY KEY (`blockid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LastBlock`
--

LOCK TABLES `LastBlock` WRITE;
/*!40000 ALTER TABLE `LastBlock` DISABLE KEYS */;
/*!40000 ALTER TABLE `LastBlock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commissions` (
  `_myid` bigint(20) NOT NULL AUTO_INCREMENT,
  `deployer_commission` double NOT NULL,
  `referrer_commission` double NOT NULL,
  `for_contractaddr_or_transhash` varchar(50) NOT NULL,
  `deployer_addr` varchar(50) NOT NULL,
  `referrer_addr` varchar(50) NOT NULL,
  PRIMARY KEY (`_myid`,`for_contractaddr_or_transhash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissions`
--

LOCK TABLES `commissions` WRITE;
/*!40000 ALTER TABLE `commissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `commissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script1`
--

DROP TABLE IF EXISTS `script1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `script1` (
  `block_num` bigint(20) NOT NULL,
  `deployer_addr` varchar(50) NOT NULL,
  `trans_fee` varchar(50) DEFAULT NULL,
  `referrer_wallet` varchar(50) DEFAULT NULL,
  `_myid` bigint(10) unsigned NOT NULL AUTO_INCREMENT,
  `contract_address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`_myid`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script1`
--

LOCK TABLES `script1` WRITE;
/*!40000 ALTER TABLE `script1` DISABLE KEYS */;
/*!40000 ALTER TABLE `script1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script1_blocks`
--

DROP TABLE IF EXISTS `script1_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `script1_blocks` (
  `_myid` bigint(20) NOT NULL AUTO_INCREMENT,
  `blknumber` bigint(20) NOT NULL,
  `blk` longblob NOT NULL,
  PRIMARY KEY (`_myid`)
) ENGINE=InnoDB AUTO_INCREMENT=775 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script1_blocks`
--

LOCK TABLES `script1_blocks` WRITE;
/*!40000 ALTER TABLE `script1_blocks` DISABLE KEYS */;
/*!40000 ALTER TABLE `script1_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script1_deployer_commission`
--

DROP TABLE IF EXISTS `script1_deployer_commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `script1_deployer_commission` (
  `deployer_commission` double NOT NULL,
  `_deployer_wallet` varchar(50) NOT NULL,
  PRIMARY KEY (`_deployer_wallet`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script1_deployer_commission`
--

LOCK TABLES `script1_deployer_commission` WRITE;
/*!40000 ALTER TABLE `script1_deployer_commission` DISABLE KEYS */;
/*!40000 ALTER TABLE `script1_deployer_commission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `script1_referrer_commission`
--

DROP TABLE IF EXISTS `script1_referrer_commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `script1_referrer_commission` (
  `referrer_commission` double NOT NULL,
  `_referrer_wallet` varchar(50) NOT NULL DEFAULT 'NA',
  PRIMARY KEY (`_referrer_wallet`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `script1_referrer_commission`
--

LOCK TABLES `script1_referrer_commission` WRITE;
/*!40000 ALTER TABLE `script1_referrer_commission` DISABLE KEYS */;
/*!40000 ALTER TABLE `script1_referrer_commission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dithereumbacked'
--

--
-- Dumping routines for database 'dithereumbacked'
--

--
-- Final view structure for view `COMMISSION_VIEW`
--

/*!50001 DROP VIEW IF EXISTS `COMMISSION_VIEW`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `COMMISSION_VIEW` AS (select sum(`commissions`.`deployer_commission`) AS `total_deployer_commission`,`commissions`.`deployer_addr` AS `deployer_addr`,NULL AS `total_referrer_commission`,NULL AS `referrer_addr` from `commissions` group by `commissions`.`deployer_addr`) union all (select NULL AS `deployer_addr`,NULL AS `total_deployer_commissions`,sum(`commissions`.`referrer_commission`) AS `total_referrer_commission`,`commissions`.`referrer_addr` AS `referrer_addr` from `commissions` where (`commissions`.`referrer_commission` <> 0) group by `commissions`.`referrer_addr`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-15 13:16:12
