-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 02, 2026 at 12:04 PM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `synx_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `buyerleads`
--

DROP TABLE IF EXISTS `buyerleads`;
CREATE TABLE IF NOT EXISTS `buyerleads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason` enum('investment','selfuse') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_dealer` enum('yes','no') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `time_to_buy` enum('3months','6months','more') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `home_loan` tinyint(1) DEFAULT '0',
  `site_visit` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buyerleads`
--

INSERT INTO `buyerleads` (`id`, `property_id`, `name`, `phone`, `reason`, `is_dealer`, `time_to_buy`, `home_loan`, `site_visit`, `created_at`) VALUES
(1, 33, 'sakshi', '8604695002', 'investment', 'no', '3months', 1, 1, '2026-01-29 12:06:18'),
(2, 32, 'shveta', '6387398136', 'investment', 'no', '3months', 1, 0, '2026-01-29 12:08:36'),
(3, 32, 'shveta', '860 469 5002', 'investment', 'no', '3months', 1, 1, '2026-01-29 12:09:45'),
(4, 33, 'sakshi', '6387398136', 'investment', 'no', '3months', 1, 1, '2026-01-29 12:48:34'),
(5, 29, 'sakshi', '08604695002', 'investment', 'no', '3months', 1, 0, '2026-01-29 13:14:46'),
(6, 28, 'sakshi', '6387398136', 'investment', 'no', '3months', 1, 1, '2026-01-29 15:57:47'),
(7, 39, 'shveta', '8604695002', 'investment', 'no', '3months', 1, 0, '2026-01-31 19:47:30'),
(8, 44, 'sakshi', '6387398136', 'investment', 'yes', '3months', 1, 0, '2026-01-31 20:41:34'),
(9, 44, 'arti', '8609878767', 'investment', 'no', '3months', 1, 0, '2026-02-01 06:39:35'),
(10, 44, 'yftddr', '8609878767', 'selfuse', 'yes', '3months', 1, 1, '2026-02-01 07:08:26'),
(11, 44, 'arti', '8609878767', 'investment', 'yes', '6months', 0, 1, '2026-02-01 07:35:50'),
(12, 44, 'simran', '8609878767', 'investment', 'yes', '3months', 1, 0, '2026-02-01 12:36:10'),
(13, 47, 'Praveen', '9720108105', 'investment', 'no', '3months', 1, 0, '2026-02-02 06:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `investorss`
--

DROP TABLE IF EXISTS `investorss`;
CREATE TABLE IF NOT EXISTS `investorss` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `requirement` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ticket_size` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investorss`
--

INSERT INTO `investorss` (`id`, `name`, `address`, `email`, `phone`, `requirement`, `ticket_size`, `created_at`) VALUES
(1, 'Shveta Maddhesiya', 'GORAKHPUR, GORAKHPUR, UTTAR PRADESH, 273212', 'sevetamaddhesiya@gmail.com', '8604695002', 'Residential Plot', '50 Lakhs', '2026-01-28 06:44:46'),
(6, 'dwq', 'wdqd', 'pravag3001@gmail.com', '763265366', 'Residential Plot', '50 Lakhs', '2026-01-28 10:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `propertie`
--

DROP TABLE IF EXISTS `propertie`;
CREATE TABLE IF NOT EXISTS `propertie` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `seller_id` int UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` enum('plot','property') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subtype` enum('residential','commercial','industrial') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `estimated_price` decimal(12,2) DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `images` longtext COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `propertie`
--

INSERT INTO `propertie` (`id`, `seller_id`, `title`, `type`, `subtype`, `description`, `estimated_price`, `location`, `image`, `status`, `created_at`, `images`) VALUES
(28, 7, 'myHomeTown', 'property', 'residential', '23sqr', 2000000.00, 'gorakhpur', '1769441491092.jpg', 'approved', '2026-01-26 15:31:31', NULL),
(29, 7, 'property', 'property', 'residential', '23sqr', 22233343.00, 'delhi', '1769494196300.webp', 'approved', '2026-01-27 06:09:56', NULL),
(31, 7, 'housh', 'plot', 'residential', '22', 2332332.00, 'delhi', '1769498369855.png', 'approved', '2026-01-27 07:19:29', NULL),
(32, 7, 'house', 'property', 'residential', '23sqr', 23232321.00, 'mayur vihar', '1769508026241.png', 'approved', '2026-01-27 10:00:26', NULL),
(33, 7, '3efdfddf', 'property', 'commercial', '22sqr', 22323232.00, 'dddd', '1769509889297.png', 'approved', '2026-01-27 10:31:29', NULL),
(36, 7, 'fffg', '', '', '78', 554545.00, 'noida', NULL, 'approved', '2026-01-31 12:50:17', '[\"1769863817058.png\",\"1769863817068.png\",\"1769863817080.png\",\"1769863817087.png\"]'),
(38, 7, '', '', '', '', 0.00, '', NULL, 'approved', '2026-01-31 17:43:05', '[\"1769881385369.png\",\"1769881385383.png\"]'),
(39, 7, 'kjjkj', '', '', 'jfdjfdfdj', 9999999999.99, 'ddj', NULL, 'approved', '2026-01-31 19:45:43', '[\"1769888743444.png\",\"1769888743478.png\",\"1769888743479.jpg\",\"1769888743489.jpg\"]'),
(40, 7, '', 'property', 'residential', '21sqr', 9999999999.99, 'delhi', NULL, 'approved', '2026-01-31 20:00:01', '[\"1769889601835.jpg\",\"1769889601858.jpg\"]'),
(44, 7, '', 'plot', 'residential', '234sqr', 9999999999.99, 'Qutub Vihar Phase 2, Delhi, Delhi South West', NULL, 'approved', '2026-01-31 20:35:29', '[\"1769891729918.jpg\",\"1769891729949.jpg\"]'),
(45, 9, 'hhggyyfyuyuutt7tvvgvvvhvhhv', 'plot', 'residential', '65sqr', 765656768.00, 'delhi', NULL, 'approved', '2026-02-01 19:22:28', '[\"1769973748759.png\",\"1769973748809.png\"]'),
(47, 8, 'Great Property', 'plot', 'residential', 'dygeyyug', 9999999999.99, 'delhi', NULL, 'approved', '2026-02-02 06:05:23', '[\"1770012323437.jpg\",\"1770012323480.jpg\",\"1770012323516.jpg\",\"1770012323551.jpg\",\"1770012323566.jpg\",\"1770012323597.jpg\"]');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
CREATE TABLE IF NOT EXISTS `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `looking_to` enum('sell','rent/lease','pg') COLLATE utf8mb4_unicode_ci NOT NULL,
  `property_type` enum('residential','commercial') COLLATE utf8mb4_unicode_ci NOT NULL,
  `property_subtype` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locality` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sub_locality` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `society` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `house_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bhk` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `balconies` int DEFAULT NULL,
  `carpet_area` int DEFAULT NULL,
  `builtup_area` int DEFAULT NULL,
  `super_builtup_area` int DEFAULT NULL,
  `area_unit` enum('sqft','sqyd','sqm') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor_no` int DEFAULT NULL,
  `total_floors` int DEFAULT NULL,
  `furnishing` enum('furnished','semi-furnished','unfurnished') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability_status` enum('ready to move','under construction') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownership` enum('freehold','leasehold','co-operative society','power of attorney') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `property_age` int DEFAULT NULL,
  `expected_price` bigint DEFAULT NULL,
  `price_per_sqft` bigint DEFAULT NULL,
  `price_negotiable` tinyint(1) DEFAULT '0',
  `all_inclusive_price` tinyint(1) DEFAULT '0',
  `tax_excluded` tinyint(1) DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci,
  `media` json DEFAULT NULL COMMENT 'JSON array of image urls and (optional) video urls',
  `amenities` json DEFAULT NULL COMMENT 'JSONArray e.g. ["Parking","Lift","Gym"]',
  `current_step` int DEFAULT '1',
  `is_completed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userss`
--

DROP TABLE IF EXISTS `userss`;
CREATE TABLE IF NOT EXISTS `userss` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('seller','admin','buyer') COLLATE utf8mb4_general_ci DEFAULT 'seller',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userss`
--

INSERT INTO `userss` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'shweta', 'shweta@gmail.com', '$2b$10$Si26wl3GwItjDF8rwfq9xOFYjCfoAatvM0ocInMqlwp3oiuX88WtK', 'admin', '2026-01-24 12:52:54'),
(3, 'sa2ekshii3', 'sakshig311up2ta@gmail.com', '$2b$10$26mPlYq8w29ZUgz8IMdxkOg3tr8/xmVS96h5sntHcyhjD07sUmvFi', 'seller', '2026-01-24 06:53:29'),
(4, 'admine', 'admin@gmail.com', '123456', 'seller', '2026-01-24 12:38:38'),
(7, 'sasa', 'shv12@gmail.com', '$2b$10$2T8A5hbaBk6qiQS7kdkRq.waqnyJ6d/0eh1pVkKyfbYdyAf33vex2', 'seller', '2026-01-25 09:55:13'),
(8, 'Praveen', 'pravag3001@gmail.com', '$2b$10$oXs.5WKqW5iHNle.5xp/FOmwvL1/rDnIfCRzFcE/xD5FL95FRZBmS', 'seller', '2026-01-28 10:20:13'),
(9, 'maddhesiya', 'maddhesi@gmail.com', '$2b$10$.noQmI42993BdR..sEMgDOGhUxc5r39HNBANi1G9kE1cDpi78uRty', 'seller', '2026-02-01 12:33:16'),
(11, 'ujjwal', 'ujjwal1@gmail.com', '$2b$10$lGhZNKo8dUfU0XDdHXtYjO5CgXWz5M7GutcHNJ6KvpKQsN8TZvDy6', 'seller', '2026-02-02 05:25:05');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `propertie`
--
ALTER TABLE `propertie`
  ADD CONSTRAINT `propertie_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `userss` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
