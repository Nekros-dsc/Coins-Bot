-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mar. 16 avr. 2024 à 13:22
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
-- Base de données : `coinsbotLevrai`
--

-- --------------------------------------------------------

--
-- Structure de la table `Cards`
--

CREATE TABLE `Cards` (
  `name` varchar(255) NOT NULL,
  `guildId` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `attaque` int(255) DEFAULT NULL,
  `vie` int(255) DEFAULT NULL,
  `proprio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Color`
--

CREATE TABLE `Color` (
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `price` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Colors`
--

CREATE TABLE `Colors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Encheres`
--

CREATE TABLE `Encheres` (
  `id` int(255) DEFAULT NULL,
  `guildId` varchar(255) NOT NULL,
  `ChannelId` varchar(255) NOT NULL,
  `MessageId` varchar(255) NOT NULL,
  `prize` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `click` varchar(255) NOT NULL,
  `lastenchere` varchar(255) NOT NULL,
  `encherisseur` varchar(255) DEFAULT NULL,
  `datestart` date NOT NULL,
  `duration` varchar(255) NOT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  `updatedAt` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Guilds`
--

CREATE TABLE `Guilds` (
  `guildId` varchar(255) NOT NULL,
  `Prefix` varchar(255) NOT NULL,
  `Add` tinyint(1) NOT NULL,
  `Remove` tinyint(1) NOT NULL,
  `Reset` tinyint(1) NOT NULL,
  `Color` varchar(255) NOT NULL DEFAULT 'F4D80B',
  `DrugPrice` varchar(255) NOT NULL DEFAULT '1000',
  `cshop` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`cshop`)),
  `FarmChannels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`FarmChannels`)),
  `Cooldowns` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Cooldowns`)),
  `Gains` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Gains`)),
  `Logs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Logs`)),
  `Prices` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Prices`)),
  `Max` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Max`)),
  `XP` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`XP`)),
  `EnchereConfig` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`EnchereConfig`)),
  `PlayChannels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`PlayChannels`)),
  `APIkey` varchar(255) DEFAULT NULL,
  `createdAt` varchar(100) DEFAULT NULL,
  `updatedAt` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Teams`
--

CREATE TABLE `Teams` (
  `teamid` varchar(255) NOT NULL,
  `guildId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cadenas` varchar(255) NOT NULL DEFAULT '5',
  `desc` varchar(255) NOT NULL,
  `coins` varchar(255) NOT NULL DEFAULT '0',
  `rep` varchar(255) NOT NULL DEFAULT '0',
  `army` varchar(255) NOT NULL DEFAULT '10',
  `blesses` varchar(255) NOT NULL DEFAULT '0',
  `trainlevel` varchar(255) NOT NULL DEFAULT '1',
  `Upgrade` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Upgrade`)),
  `members` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `banner` int(255) DEFAULT NULL,
  `primary` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `UserId` varchar(65) NOT NULL,
  `GuildId` varchar(65) NOT NULL,
  `Coins` varchar(255) DEFAULT '0',
  `Bank` varchar(255) DEFAULT '0',
  `Rep` varchar(255) DEFAULT '0',
  `Drugs` varchar(255) DEFAULT '0',
  `Entrepot` varchar(255) DEFAULT '0',
  `XP` varchar(255) DEFAULT '0',
  `level` varchar(255) DEFAULT '1',
  `Card` varchar(65) DEFAULT NULL,
  `Victoires` varchar(255) DEFAULT '0',
  `Minerais` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`Minerais`)),
  `Batiments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Batiments`)),
  `Color` varchar(65) DEFAULT NULL,
  `Cooldown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`Cooldown`)),
  `Capacite` varchar(65) DEFAULT NULL,
  `Metier` varchar(65) DEFAULT NULL,
  `Vocal` tinyint(1) DEFAULT 1,
  `ThreeMinutes` varchar(255) DEFAULT '0',
  `createdAt` varchar(100) DEFAULT NULL,
  `updatedAt` varchar(100) DEFAULT NULL,
  `primary` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Cards`
--
ALTER TABLE `Cards`
  ADD PRIMARY KEY (`name`,`guildId`);

--
-- Index pour la table `Colors`
--
ALTER TABLE `Colors`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Guilds`
--
ALTER TABLE `Guilds`
  ADD PRIMARY KEY (`guildId`);

--
-- Index pour la table `Teams`
--
ALTER TABLE `Teams`
  ADD PRIMARY KEY (`primary`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`primary`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Colors`
--
ALTER TABLE `Colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Teams`
--
ALTER TABLE `Teams`
  MODIFY `primary` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `primary` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
