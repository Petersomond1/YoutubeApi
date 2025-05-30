-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 29, 2025 at 04:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `youtubeapis3_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `media_files`
--

CREATE TABLE `media_files` (
  `id` int(11) NOT NULL,
  `file_name` varchar(512) NOT NULL,
  `file_url` varchar(2048) NOT NULL,
  `file_type` varchar(100) NOT NULL,
  `size` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `tags` varchar(512) DEFAULT NULL,
  `thumbnail` varchar(2048) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `resolution` varchar(50) DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `monetization` tinyint(1) NOT NULL DEFAULT 0,
  `rights_claims` varchar(255) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `video_transcript` text DEFAULT NULL,
  `geo_coordinates` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `thumbnail_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_files`
--

INSERT INTO `media_files` (`id`, `file_name`, `file_url`, `file_type`, `size`, `description`, `title`, `tags`, `thumbnail`, `category`, `duration`, `resolution`, `format`, `monetization`, `rights_claims`, `comments`, `video_transcript`, `geo_coordinates`, `created_at`, `updated_at`, `thumbnail_url`) VALUES
(1, 'abc_african_suit_for_men_2.png', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/4a1b3c1a-9738-4e58-8546-d4fbf8ff1ba2.abc_african_suit_for_men_2.png', 'image/png', 814380, 'fdhdfh', 'qsda', 'rwerew', 'vxvx', 'training', '4', 'wrerwe', 'png', 1, 'wrerwe', 'cvcv', 'wererw', 'iuhpiu', '2025-05-15 05:39:32', '2025-05-19 00:32:15', NULL),
(2, 'Build_and_Deploy_a_Modern_YouTube_Clone_Application_in_React_JS_with_Materia_HIGH.mp4', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/59e60280-fb46-44dc-8f53-b1e79592c5ba.Build_and_Deploy_a_Modern_YouTube_Clone_Application_in_React_JS_with_Materia_HIGH.mp4', 'video/mp4', 201357652, 'this is about the teaching or react js', 'react teaching', 'react, computer, video, best', 'adada@was.cet', 'training', '30mins', '107p', 'mp4', 1, 'copyrighted', 'THis is a good video that says what it ads', 'none', 'Africa', '2025-05-15 06:08:34', '2025-05-19 00:32:01', NULL),
(3, 'Acoustic_Audio_Speaker_System.webm', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/440c639b-bf61-41d3-a555-e48dcc71f83e.Acoustic_Audio_Speaker_System.webm', 'video/webm', 7959235, 'jlkjkll', 'sadsdad', 'sfsf, kjkk, errete, ddfgdg', 'bcvbbvcc', 'New', 'dffgfg', 'dfgdfgfg', 'webm', 1, 'dfgfgg', 'ioio', 'sfsf', 'yrtyy', '2025-05-18 18:21:11', '2025-05-19 00:31:47', NULL),
(4, 'MYSQL_NODE_JS_TUTORIAL_POSTMAN_FETCH_data_from_Mysql_database_using_Node_JS_and_Postman_tutorial___Get_all__HD.mp4', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/5fdee19c-fa14-427a-9dc2-5023c5047754.2_MYSQL_NODE_JS_TUTORIAL_POSTMAN_FETCH_data_from_Mysql_database_using_Node_JS_and_Postman_tutorial___Get_all__HD.mp4', 'video/mp4', 27052292, 'Postman fetch training', 'POstman', 'sfsf, kjkk, errete, ddfgdg', 'abc@abc.com', 'New', 'dffgfg', 'dfgdfgfg', 'mp4', 1, 'dfgfgg', 'ioio', 'sfsf', 'yrtyy', '2025-05-18 18:30:41', '2025-05-19 00:31:36', NULL),
(5, 'Amazon_echo_Glow._multi_color_.webm', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/80558096-d1d4-4cc8-b918-38156ddb5e29.Amazon_echo_Glow._multi_color_.webm', 'video/webm', 13965035, 'Amazon light marketing', 'Amazon echo', 'sfsf, kjkk, errete, ddfgdg', 'abc@abc.com', 'New', 'dffgfg', 'dfgdfgfg', 'webm', 1, 'dfgfgg', 'ioio', 'sfsf', 'yrtyy', '2025-05-18 19:01:09', '2025-05-19 00:31:26', NULL),
(6, 'Dyson_Hair_straithener.webm', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/6d7b0aa3-df4a-41d6-8d30-7b91d70bb0fb.Dyson_Hair_straithener.webm', 'video/webm', 7947739, 'ddvsdf', 'dyson hair ', 'jbkjb, hvluv, kj;', 'hiuh', 'New', 'k', 'ghhhj', 'webm', 1, 'dffd', 'gfg', 'fgfgf', 'dfdffd', '2025-05-18 22:13:26', '2025-05-19 00:31:18', NULL),
(7, 'fathers_day_gift_amazon.webm', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/4633f9d9-fe67-487d-8b5f-b35cac519c87.fathers_day_gift_amazon.webm', 'video/webm', 52291410, 'fjm', 'sqdfqdmj', 'mfjm', 'jfmj', 'New', 'mkm', 'jmf', 'webm', 1, 'mkj', 'mjm', 'm', 'm', '2025-05-18 22:20:43', '2025-05-19 00:32:51', NULL),
(8, 'designer_dresses_for_spring.webm', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/b937c49e-415c-44e3-9e0f-1d0921591526.designer_dresses_for_spring.webm', 'video/webm', 10560784, 'fjm', 'sqdfqdmj', 'mfjm', 'jfmj', 'New', 'mkm', 'jmf', 'webm', 1, 'mkj', 'mjm', 'm', 'm', '2025-05-18 22:43:51', '2025-05-19 00:32:59', NULL),
(9, 'dieties_like_eze-urukwu.mp4', 'https://youtubeapitesting.S3.us-east-1.amazonaws.com/uploads/dieties_like_eze-urukwu.mp4', 'video/mp4', 29466238, 'giug', 'eze-ukwu', 'hiuh', 'figyryoi7t', 'Home', '10 mins', '450', 'mp4', 1, 'gdfdf', 'gfgjhhjj', 'dffss', 'hkhgkhjk', '2025-05-19 00:27:28', '2025-05-19 00:27:28', NULL),
(10, '1747923657249-04exjv.postman_texting_not_working.webm', 'https://youtubeapitesting.s3.us-east-1.amazonaws.com/uploads/1747923657249-04exjv.postman_texting_not_working.webm', 'video/webm', 3480647, 'fgsdgsdfgdfgd', 'postman texting not working', NULL, NULL, 'New', '0:11', '1920x1080', 'webm', 0, NULL, NULL, NULL, NULL, '2025-05-22 14:21:03', '2025-05-22 14:21:03', 'https://youtubeapitesting.s3.us-east-1.amazonaws.com/uploads/thumbnails/1747923663484-45mxw3.thumb_thumbnail.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `media_files`
--
ALTER TABLE `media_files`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `media_files`
--
ALTER TABLE `media_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
