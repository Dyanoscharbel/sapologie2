-- Migration: Add banner, gender, and prize images to competitions
-- Date: 2024
-- Description: Adds banner image, gender type, and prize images to competitions system

-- Add columns to competitions table
ALTER TABLE `competitions` 
ADD COLUMN `banner_image` LONGTEXT DEFAULT NULL COMMENT 'Competition banner image (Base64)',
ADD COLUMN `gender` VARCHAR(50) DEFAULT 'Mixte' COMMENT 'Competition type: Mixte, Masculin, Féminin';

-- Add image column to prizes table
ALTER TABLE `prizes`
ADD COLUMN `image` LONGTEXT DEFAULT NULL COMMENT 'Prize image (Base64)';

-- Verify the columns were added successfully
-- SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME IN ('competitions', 'prizes') AND TABLE_SCHEMA = 'DATABASE_NAME'
-- ORDER BY TABLE_NAME, ORDINAL_POSITION DESC LIMIT 8;