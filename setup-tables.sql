-- Copy this SQL and run in Supabase SQL Editor

-- Create products table
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  weight REAL,
  stock INTEGER DEFAULT 0,
  images TEXT[],
  banner_images TEXT[],
  category_id VARCHAR(255),
  brand VARCHAR(255),
  rating REAL DEFAULT 0,
  num_reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_banner BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create categories table  
CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- IMPORTANT: Enable Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
