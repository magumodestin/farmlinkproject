-- Adds profile-picture support to an existing FarmLink database.
-- Safe to run once against a database created before this change; schema.sql
-- already includes this column for brand-new installs.
USE farmlink;

ALTER TABLE users
  ADD COLUMN avatar_url VARCHAR(255) NULL AFTER verification_status;
