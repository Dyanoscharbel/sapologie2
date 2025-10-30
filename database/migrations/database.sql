-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 28 oct. 2025 à 13:54
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sapologie`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password_hash`, `full_name`, `is_super_admin`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin@sapologie.com', '$2b$10$BBYPzsY2HsiHRd7S5OgPBeLiPIzqcPG2N06nQIImXYndbCgTL383a', 'ADMIN ', 1, '2025-10-17 18:22:08', '2025-10-16 14:56:02', '2025-10-17 18:22:08');

-- --------------------------------------------------------

--
-- Structure de la table `admin_activities`
--

CREATE TABLE `admin_activities` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `competitions`
--

CREATE TABLE `competitions` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `prize_first` varchar(255) DEFAULT NULL,
  `prize_second` varchar(255) DEFAULT NULL,
  `prize_third` varchar(255) DEFAULT NULL,
  `max_votes_per_user` int(11) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `competitions`
--

INSERT INTO `competitions` (`id`, `name`, `description`, `start_date`, `end_date`, `is_active`, `prize_first`, `prize_second`, `prize_third`, `max_votes_per_user`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'F', 'FGHJK', '2025-10-16 18:00:00', '2025-10-18 18:00:00', 1, '', '', '', 1, NULL, '2025-10-17 18:49:52', '2025-10-17 18:50:17');

-- --------------------------------------------------------

--
-- Structure de la table `competition_entries`
--

CREATE TABLE `competition_entries` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) DEFAULT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `votes_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `media_data` longtext NOT NULL,
  `media_type` varchar(50) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `position` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `media`
--

INSERT INTO `media` (`id`, `participant_id`, `media_data`, `media_type`, `file_name`, `file_size`, `is_primary`, `position`, `created_at`) VALUES
(1, 2, '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', 'image/jpeg', 'd.jpg', NULL, 1, 0, '2025-10-17 17:58:59');

-- --------------------------------------------------------

--
-- Structure de la table `participants`
--

CREATE TABLE `participants` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `stage_name` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `favorite_style` varchar(100) DEFAULT NULL,
  `inspiration` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `participants`
--

INSERT INTO `participants` (`id`, `user_id`, `stage_name`, `bio`, `category`, `location`, `age`, `favorite_style`, `inspiration`, `is_approved`, `is_featured`, `created_at`, `updated_at`) VALUES
(2, 2, 'Dyanos Charbel', '', '', '', NULL, NULL, NULL, 1, 0, '2025-10-17 00:05:30', '2025-10-17 17:48:56');

-- --------------------------------------------------------

--
-- Structure de la table `prizes`
--

CREATE TABLE `prizes` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `position` int(11) NOT NULL,
  `value` decimal(10,2) DEFAULT NULL,
  `sponsor` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `platform` varchar(50) NOT NULL,
  `username` varchar(100) NOT NULL,
  `url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `pseudo` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `avatar_base64` longtext DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `avatar_base64`, `is_active`, `email_verified`, `created_at`, `updated_at`) VALUES
(2, '', 'charbelsanni25@gmail.com', '$2b$10$rs4Qiwl9TSSSeO59vjQ82Ok9YD1oiSYd01ZwT4uHFN46ENqpqUDFu', 'Dyanos', 'Charbel', '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', 1, 0, '2025-10-17 00:04:50', '2025-10-17 17:48:56');

-- --------------------------------------------------------

--
-- Structure de la table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `voter_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `winners`
--

CREATE TABLE `winners` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) DEFAULT NULL,
  `participant_id` int(11) DEFAULT NULL,
  `prize_id` int(11) DEFAULT NULL,
  `position` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `admin_activities`
--
ALTER TABLE `admin_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Index pour la table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_competition_participant` (`competition_id`,`participant_id`),
  ADD KEY `idx_competition_entries_competition_id` (`competition_id`),
  ADD KEY `idx_competition_entries_participant_id` (`participant_id`);

--
-- Index pour la table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_participant_id` (`participant_id`);

--
-- Index pour la table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `prizes`
--
ALTER TABLE `prizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Index pour la table `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_platform_per_participant` (`participant_id`,`platform`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vote` (`participant_id`,`voter_id`),
  ADD KEY `idx_votes_participant_id` (`participant_id`),
  ADD KEY `idx_votes_voter_id` (`voter_id`);

--
-- Index pour la table `winners`
--
ALTER TABLE `winners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `participant_id` (`participant_id`),
  ADD KEY `prize_id` (`prize_id`),
  ADD KEY `created_by` (`created_by`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `admin_activities`
--
ALTER TABLE `admin_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `competitions`
--
ALTER TABLE `competitions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `competition_entries`
--
ALTER TABLE `competition_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `prizes`
--
ALTER TABLE `prizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `winners`
--
ALTER TABLE `winners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admin_activities`
--
ALTER TABLE `admin_activities`
  ADD CONSTRAINT `admin_activities_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `competitions`
--
ALTER TABLE `competitions`
  ADD CONSTRAINT `competitions_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `competition_entries`
--
ALTER TABLE `competition_entries`
  ADD CONSTRAINT `competition_entries_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `competition_entries_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `prizes`
--
ALTER TABLE `prizes`
  ADD CONSTRAINT `prizes_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prizes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`voter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `winners`
--
ALTER TABLE `winners`
  ADD CONSTRAINT `winners_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winners_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winners_ibfk_3` FOREIGN KEY (`prize_id`) REFERENCES `prizes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `winners_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
