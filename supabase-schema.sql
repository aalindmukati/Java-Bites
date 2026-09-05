-- Database schema for Java Bites

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    cuisine_type TEXT,
    location_in_court TEXT,
    is_open BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT true
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    reviewer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Sample Data

-- Clear existing data (optional, remove if you don't want to reset)
DELETE FROM reviews;
DELETE FROM menu_items;
DELETE FROM vendors;

-- Insert Vendors
INSERT INTO vendors (id, name, description, cuisine_type, location_in_court, is_open, image_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'The Spice Route', 'Authentic North and South Indian curries, biryanis, and thalis.', 'Indian', 'Stall A1', true, 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop'),
('22222222-2222-2222-2222-222222222222', 'Wok This Way', 'Quick, hot, and spicy Chinese noodles and stir-fries.', 'Chinese', 'Stall B2', true, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=1000&auto=format&fit=crop'),
('33333333-3333-3333-3333-333333333333', 'Cafe Java', 'Premium coffee, sandwiches, and freshly baked pastries.', 'Cafe', 'Stall C3', false, 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop');

-- Insert Menu Items for 'The Spice Route'
INSERT INTO menu_items (vendor_id, name, price, category, is_veg) VALUES 
('11111111-1111-1111-1111-111111111111', 'Butter Chicken Masala', 250, 'Mains', false),
('11111111-1111-1111-1111-111111111111', 'Paneer Tikka', 200, 'Mains', true),
('11111111-1111-1111-1111-111111111111', 'Garlic Naan', 40, 'Breads', true);

-- Insert Menu Items for 'Wok This Way'
INSERT INTO menu_items (vendor_id, name, price, category, is_veg) VALUES 
('22222222-2222-2222-2222-222222222222', 'Hakka Noodles', 150, 'Noodles', true),
('22222222-2222-2222-2222-222222222222', 'Chilli Chicken', 180, 'Starters', false),
('22222222-2222-2222-2222-222222222222', 'Veg Spring Rolls', 120, 'Starters', true);

-- Insert Menu Items for 'Cafe Java'
INSERT INTO menu_items (vendor_id, name, price, category, is_veg) VALUES 
('33333333-3333-3333-3333-333333333333', 'Cappuccino', 120, 'Beverages', true),
('33333333-3333-3333-3333-333333333333', 'Cold Coffee', 140, 'Beverages', true),
('33333333-3333-3333-3333-333333333333', 'Chocolate Croissant', 90, 'Snacks', true);

-- Insert Sample Reviews
INSERT INTO reviews (vendor_id, reviewer_name, rating, review_text) VALUES 
('11111111-1111-1111-1111-111111111111', 'Rahul S.', 5, 'Best butter chicken in the campus!'),
('11111111-1111-1111-1111-111111111111', 'Anjali M.', 4, 'Paneer was soft and fresh.'),
('22222222-2222-2222-2222-222222222222', 'Karan T.', 3, 'Noodles were a bit too spicy for me.'),
('33333333-3333-3333-3333-333333333333', 'Priya K.', 5, 'Perfect place for a quick coffee break between classes.');

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public read vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Allow public inserts (since this app does not require authentication)
CREATE POLICY "Public insert vendors" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

