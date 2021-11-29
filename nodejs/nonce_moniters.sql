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
-- Table structure for table `AdminWallets`
--

DROP TABLE IF EXISTS `AdminWallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AdminWallets` (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `walletid` varchar(100) NOT NULL,
  `walletpk` varchar(100) NOT NULL,
  `chainid` int(11) NOT NULL,
  `networkid` varchar(30) NOT NULL,
  `isFrozen` tinyint(1) NOT NULL DEFAULT '0',
  `secretphrase` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`autoid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AdminWallets`
--

LOCK TABLES `AdminWallets` WRITE;
/*!40000 ALTER TABLE `AdminWallets` DISABLE KEYS */;
INSERT INTO `AdminWallets` VALUES (1,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',4,'rinkeby',0,NULL),(2,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',4,'rinkeby',1,NULL),(3,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',4,'rinkeby',1,NULL),(4,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',4,'rinkeby',0,NULL);
/*!40000 ALTER TABLE `AdminWallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noncetable`
--

DROP TABLE IF EXISTS `noncetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noncetable` (
  `nonceid` bigint(20) NOT NULL AUTO_INCREMENT,
  `walletid` varchar(100) NOT NULL,
  `nonce` int(11) NOT NULL,
  `chainid` int(11) NOT NULL,
  `networkid` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`nonceid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noncetable`
--

LOCK TABLES `noncetable` WRITE;
/*!40000 ALTER TABLE `noncetable` DISABLE KEYS */;
INSERT INTO `noncetable` VALUES (1,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc',101,4,'rinkeby'),(2,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59',102,4,'rinkeby');
/*!40000 ALTER TABLE `noncetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web3networks`
--

DROP TABLE IF EXISTS `web3networks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web3networks` (
  `autoid` int(11) NOT NULL AUTO_INCREMENT,
  `networkid` varchar(30) DEFAULT NULL,
  `web3providerurl` varchar(300) DEFAULT NULL,
  `chainid` int(11) NOT NULL,
  PRIMARY KEY (`chainid`),
  UNIQUE KEY `autoid` (`autoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web3networks`
--

LOCK TABLES `web3networks` WRITE;
/*!40000 ALTER TABLE `web3networks` DISABLE KEYS */;
INSERT INTO `web3networks` VALUES (1,'rinkeby','https://rinkeby.infura.io/v3/8102c6c81e12418588c89d69ac7a3f04',4),(2,'google','http://google.com',989);
/*!40000 ALTER TABLE `web3networks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dithereumbacked'
--

--
-- Dumping routines for database 'dithereumbacked'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-29 23:47:44
