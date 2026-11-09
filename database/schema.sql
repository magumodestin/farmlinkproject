CREATE DATABASE IF NOT EXISTS farmlink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmlink;
CREATE TABLE users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 full_name VARCHAR(150) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 phone VARCHAR(40),
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('buyer','seller','driver','admin') NOT NULL DEFAULT 'buyer',
 verification_status ENUM('not_required','pending','approved','rejected') NOT NULL DEFAULT 'not_required',
 avatar_url VARCHAR(255) NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE seller_verifications (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL UNIQUE,
 id_reference VARCHAR(120) NOT NULL,
 business_name VARCHAR(190),
 proof_reference VARCHAR(255),
 status ENUM('pending','approved','rejected') DEFAULT 'pending',
 reviewed_at DATETIME NULL,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE drivers (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL UNIQUE,
 vehicle_make VARCHAR(80) NOT NULL,
 vehicle_model VARCHAR(80) NOT NULL,
 vehicle_year SMALLINT,
 registration_no VARCHAR(50) NOT NULL,
 service_area VARCHAR(190) NOT NULL,
 hourly_rate DECIMAL(10,2) DEFAULT 0,
 rating DECIMAL(3,2) DEFAULT 5.00,
 vehicle_description TEXT,
 verification_status ENUM('pending','approved','rejected') DEFAULT 'pending',
 available TINYINT(1) DEFAULT 0,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE products (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 seller_id BIGINT UNSIGNED NOT NULL,
 name VARCHAR(190) NOT NULL,
 description TEXT,
 price DECIMAL(12,2) NOT NULL,
 sale_price DECIMAL(12,2) NULL,
 stock INT NOT NULL DEFAULT 0,
 image_url VARCHAR(255),
 category VARCHAR(100) NOT NULL DEFAULT 'Farm Goods',
 unit VARCHAR(80) NOT NULL DEFAULT 'unit',
 location VARCHAR(190),
 badge VARCHAR(40) NULL,
 demo_key VARCHAR(80) NULL,
 is_service TINYINT(1) NOT NULL DEFAULT 0,
 status ENUM('active','inactive','sold_out') NOT NULL DEFAULT 'active',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX(seller_id,status),
 FOREIGN KEY(seller_id) REFERENCES users(id)
);
CREATE TABLE orders (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 buyer_id BIGINT UNSIGNED NOT NULL,
 driver_id BIGINT UNSIGNED NULL,
 status ENUM('pending_payment','paid','preparing','picked_up','in_transit','delivered','cancelled') DEFAULT 'pending_payment',
 total DECIMAL(12,2) NOT NULL,
 delivery_fee DECIMAL(12,2) DEFAULT 0,
 payment_provider VARCHAR(40),
 payment_reference VARCHAR(190),
 delivery_address TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(buyer_id) REFERENCES users(id), FOREIGN KEY(driver_id) REFERENCES drivers(id)
);
CREATE TABLE order_items (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 order_id BIGINT UNSIGNED NOT NULL,
 product_id BIGINT UNSIGNED NOT NULL,
 quantity INT NOT NULL,
 unit_price DECIMAL(12,2) NOT NULL,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY(product_id) REFERENCES products(id)
);
CREATE TABLE messages (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 sender_id BIGINT UNSIGNED NOT NULL,
 receiver_id BIGINT UNSIGNED NOT NULL,
 body TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 read_at DATETIME NULL,
 FOREIGN KEY(sender_id) REFERENCES users(id), FOREIGN KEY(receiver_id) REFERENCES users(id)
);
CREATE TABLE driver_locations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 driver_id BIGINT UNSIGNED NOT NULL,
 latitude DECIMAL(10,7) NOT NULL,
 longitude DECIMAL(10,7) NOT NULL,
 recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX(driver_id,recorded_at), FOREIGN KEY(driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);
CREATE TABLE payment_transactions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 order_id BIGINT UNSIGNED NOT NULL,
 provider VARCHAR(50) NOT NULL,
 provider_reference VARCHAR(190),
 amount DECIMAL(12,2) NOT NULL,
 currency CHAR(3) DEFAULT 'ZAR',
 status ENUM('created','pending','paid','failed','refunded') DEFAULT 'created',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

ALTER TABLE users ADD COLUMN email_verified TINYINT(1) NOT NULL DEFAULT 0 AFTER verification_status;
CREATE TABLE email_verifications (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 code_hash VARCHAR(255) NOT NULL,
 expires_at DATETIME NOT NULL,
 used_at DATETIME NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX(user_id, used_at, expires_at),
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE livestock_listings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 seller_id BIGINT UNSIGNED NOT NULL,
 species ENUM('cattle','sheep','goat','pig','poultry','horse','donkey','rabbit','other') NOT NULL,
 breed VARCHAR(120),
 listing_title VARCHAR(190) NOT NULL,
 sex ENUM('male','female','mixed','unknown') DEFAULT 'unknown',
 age_months INT NULL,
 quantity INT NOT NULL DEFAULT 1,
 price DECIMAL(12,2) NOT NULL,
 price_type ENUM('per_animal','per_kg','lot','contact_seller') DEFAULT 'per_animal',
 weight_kg DECIMAL(10,2) NULL,
 location VARCHAR(190) NOT NULL,
 description TEXT,
 health_status VARCHAR(190),
 vaccination_status VARCHAR(190),
 identification_reference VARCHAR(120),
 transport_available TINYINT(1) NOT NULL DEFAULT 0,
 image_url VARCHAR(255),
 status ENUM('active','reserved','sold','inactive') DEFAULT 'active',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE,
 INDEX(species,status,location)
);
