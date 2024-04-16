-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 16 avr. 2024 à 13:21
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `managerCoins`
--

-- --------------------------------------------------------

--
-- Structure de la table `Bots`
--

CREATE TABLE `Bots` (
  `id` varchar(255) NOT NULL,
  `botid` varchar(65) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `default_prefix` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `max_guild` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `DateStart` date DEFAULT NULL,
  `Duration` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `activitytype` varchar(255) DEFAULT NULL,
  `lastWarningTime` date DEFAULT NULL,
  `Whitelist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`Whitelist`)),
  `hasWarned` tinyint(1) DEFAULT NULL,
  `createdAt` varchar(255) DEFAULT NULL,
  `Owners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Owners`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Bots`
--
ALTER TABLE `Bots`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
