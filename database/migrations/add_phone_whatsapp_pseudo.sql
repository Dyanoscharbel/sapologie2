-- Migration: Add phone, whatsapp, pseudo, country, and country_code fields to users table
-- Date: 2024
-- Description: Adds five new optional fields to store user contact information, nickname, and location details

ALTER TABLE `users` 
ADD COLUMN `pseudo` varchar(100) DEFAULT NULL COMMENT 'Optional nickname for the user',
ADD COLUMN `phone` varchar(20) DEFAULT NULL COMMENT 'User phone number (also used for WhatsApp)',
ADD COLUMN `whatsapp` varchar(20) DEFAULT NULL COMMENT 'WhatsApp number (same as phone)',
ADD COLUMN `country` varchar(100) DEFAULT NULL COMMENT 'User country name (e.g., Maroc)',
ADD COLUMN `country_code` varchar(10) DEFAULT NULL COMMENT 'Country code (e.g., MA) and phone prefix (e.g., +212)';

-- Verify the columns were added successfully
-- SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'DATABASE_NAME'
-- ORDER BY ORDINAL_POSITION DESC LIMIT 5;