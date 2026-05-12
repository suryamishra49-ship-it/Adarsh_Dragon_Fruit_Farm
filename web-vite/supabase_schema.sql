-- SQL Schema for Adarsh Dragon Fruit Farm
-- Run this in your Supabase SQL Editor

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  image TEXT,
  description TEXT,
  category TEXT NOT NULL,
  allowed_payments TEXT[] DEFAULT '{cod, upi, card, netbanking}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  total DECIMAL NOT NULL,
  status TEXT DEFAULT 'Pending',
  tracking_id TEXT,
  address JSONB NOT NULL,
  items JSONB NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMINS TABLE (For secondary admins)
CREATE TABLE IF NOT EXISTS verified_admins (
  email TEXT PRIMARY KEY,
  added_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEDIA GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type TEXT NOT NULL, -- 'image' or 'video'
  url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) or disable it temporarily for testing
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- For initial setup, you might want to allow public read and authenticated write
