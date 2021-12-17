-- MySQL dump 10.13  Distrib 5.7.36, for Linux (x86_64)
--
-- Host: localhost    Database: DTH_ADMIN_DB
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
-- Table structure for table `contract_orders`
--

DROP TABLE IF EXISTS `contract_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract_orders` (
  `chainid` bigint(20) DEFAULT NULL,
  `orderid` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_orders`
--

LOCK TABLES `contract_orders` WRITE;
/*!40000 ALTER TABLE `contract_orders` DISABLE KEYS */;
INSERT INTO `contract_orders` VALUES (0,4);
/*!40000 ALTER TABLE `contract_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nonce_admin_table`
--

DROP TABLE IF EXISTS `nonce_admin_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nonce_admin_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `walletid` varchar(100) NOT NULL,
  `walletpk` varchar(100) NOT NULL,
  `chainid` int(11) NOT NULL,
  `isFrozen` tinyint(1) NOT NULL,
  `secretphrase` varchar(300) DEFAULT NULL,
  `freezetime` int(11) DEFAULT '0',
  `nonce` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nonce_admin_table`
--

LOCK TABLES `nonce_admin_table` WRITE;
/*!40000 ALTER TABLE `nonce_admin_table` DISABLE KEYS */;
INSERT INTO `nonce_admin_table` VALUES (1,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',4,1,NULL,1639744997,428),(2,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',4,1,NULL,1639744823,NULL),(3,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',4,0,NULL,0,NULL),(4,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',4,0,NULL,0,NULL),(5,'0xe72396544b18f229f7efE373c58B6948F75FaCD2','2905caabb2b6c6a057d40a0c7653d8b5c3f2189f8eb726d140b517a12a6f1d12',4,0,NULL,0,NULL),(6,'0x9dD35f936298565Cc17c241fc645Eb4D1e04d895','2079696c01f5e53190aa1c72e57a72b93ca4ff165bf46d6ffef3129d108a879f',34,0,NULL,0,NULL),(7,'0x6077516eea959B7fb04bB211AD0569351f3eBDbc','8342678b959589fb5ad3cc593b410d892c8cb243363b2a30ee817070a89e8e8b',34,0,NULL,0,NULL),(8,'0x62E1960De1F9CA64d8fA578E871c2fe48b596b59','daedd37c356345aa579c5aff0a8d17e90fe9deec38054eb072fbbd10dd753942',34,0,NULL,0,NULL),(9,'0xF420Bc88E472191B936e7904b17DFD9E6043C12e','43f92fcfbecf0aa228b427f9f3958cf12a2ef9498310bbc26216445f54e7a47b',34,0,NULL,0,NULL),(10,'0xe72396544b18f229f7efE373c58B6948F75FaCD2','2905caabb2b6c6a057d40a0c7653d8b5c3f2189f8eb726d140b517a12a6f1d12',34,0,NULL,0,NULL);
/*!40000 ALTER TABLE `nonce_admin_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'DTH_ADMIN_DB'
--

--
-- Dumping routines for database 'DTH_ADMIN_DB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-17 18:24:50
