-- For an EXISTING MySQL database created from the older schema.sql.
USE farmlink;
ALTER TABLE products
  ADD COLUMN sale_price DECIMAL(12,2) NULL AFTER price,
  ADD COLUMN badge VARCHAR(40) NULL,
  ADD COLUMN demo_key VARCHAR(80) NULL,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  MODIFY COLUMN status ENUM('active','inactive','sold_out') NOT NULL DEFAULT 'active',
  ADD INDEX idx_products_seller_status (seller_id,status);
ALTER TABLE livestock_listings
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
-- Then load demo data with:  php database/manage.php seed
