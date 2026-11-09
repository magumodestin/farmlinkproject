-- FarmLink SQLite schema. Applied automatically the first time the API runs.
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer','seller','driver','admin')),
  verification_status TEXT NOT NULL DEFAULT 'not_required' CHECK (verification_status IN ('not_required','pending','approved','rejected')),
  email_verified INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE seller_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  id_reference TEXT NOT NULL,
  business_name TEXT,
  proof_reference TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_at TEXT
);
CREATE TABLE drivers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER,
  registration_no TEXT NOT NULL,
  service_area TEXT NOT NULL,
  hourly_rate REAL DEFAULT 0,
  rating REAL DEFAULT 5.00,
  vehicle_description TEXT,
  verification_status TEXT DEFAULT 'pending',
  available INTEGER DEFAULT 0
);
CREATE TABLE email_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_email_ver ON email_verifications(user_id, used_at, expires_at);

-- Every product belongs to exactly one seller (seller_id). status:
-- active (on sale) | inactive (hidden by seller) | sold_out (stock reached 0)
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  sale_price REAL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'Farm Goods',
  unit TEXT NOT NULL DEFAULT 'unit',
  location TEXT,
  badge TEXT,
  demo_key TEXT,
  is_service INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','sold_out')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_seller ON products(seller_id, status);
CREATE INDEX idx_products_status ON products(status);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  driver_id INTEGER REFERENCES drivers(id),
  status TEXT NOT NULL DEFAULT 'pending_payment',
  total REAL NOT NULL,
  delivery_fee REAL DEFAULT 0,
  payment_provider TEXT,
  payment_reference TEXT,
  delivery_address TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TEXT
);
CREATE TABLE driver_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  driver_id INTEGER NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE payment_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_reference TEXT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  status TEXT DEFAULT 'created',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE livestock_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  species TEXT NOT NULL,
  breed TEXT,
  listing_title TEXT NOT NULL,
  sex TEXT DEFAULT 'unknown',
  age_months INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1,
  price REAL NOT NULL,
  price_type TEXT DEFAULT 'per_animal',
  weight_kg REAL,
  location TEXT NOT NULL,
  description TEXT,
  health_status TEXT,
  vaccination_status TEXT,
  identification_reference TEXT,
  transport_available INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','reserved','sold','inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_livestock_seller ON livestock_listings(seller_id, status);
