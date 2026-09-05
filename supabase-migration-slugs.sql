-- ==============================================================================
-- Java Bites: Vendor Slug Migration Script
-- ==============================================================================
-- Run this SQL in your Supabase Dashboard SQL Editor (or via Supabase CLI).
-- It adds a unique, human-readable 'slug' column to the 'vendors' table,
-- populates all existing vendors deterministically, and handles collisions.

-- 1. Add slug column to vendors table if it doesn't already exist
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Slug generation helper function
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) RETURNS TEXT AS $$
DECLARE
    clean_title TEXT;
BEGIN
    clean_title := lower(trim(title));
    clean_title := regexp_replace(clean_title, '[^a-z0-9\s-]', '', 'g');
    clean_title := regexp_replace(clean_title, '[\s_-]+', '-', 'g');
    clean_title := regexp_replace(clean_title, '^-+|-+$', '', 'g');
    RETURN clean_title;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Populate slugs for known existing vendors deterministically
UPDATE vendors SET slug = 'dzok-cafe' WHERE name ILIKE 'Dzok Cafe' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'butty' WHERE name ILIKE 'Butty' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'sr-chat-corner' WHERE name ILIKE '%S.R%Chat%' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'quality-king-food' WHERE name ILIKE 'Quality King Food' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'google-food-park' WHERE name ILIKE '%GOOGLE Food Park%' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'evergreen' WHERE name ILIKE 'Evergreen' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'classic-biryani' WHERE name ILIKE 'Classic Biryani' AND (slug IS NULL OR slug = '');
UPDATE vendors SET slug = 'new-classic-chettinad-java' WHERE (name ILIKE '%New Classic Chettinad%' OR name ILIKE '%New Classic Chettinadu%') AND (slug IS NULL OR slug = '');

-- 4. Deterministic collision resolution for any remaining/future records lacking slug
DO $$
DECLARE
    v RECORD;
    base_slug TEXT;
    candidate_slug TEXT;
    counter INT;
BEGIN
    FOR v IN SELECT id, name FROM vendors WHERE slug IS NULL OR slug = '' ORDER BY created_at ASC LOOP
        base_slug := generate_slug(v.name);
        IF base_slug IS NULL OR base_slug = '' THEN
            base_slug := 'vendor';
        END IF;

        candidate_slug := base_slug;
        counter := 1;

        -- If collision found, append -2, -3, etc.
        WHILE EXISTS (SELECT 1 FROM vendors WHERE slug = candidate_slug AND id <> v.id) LOOP
            counter := counter + 1;
            candidate_slug := base_slug || '-' || counter;
        END LOOP;

        UPDATE vendors SET slug = candidate_slug WHERE id = v.id;
    END LOOP;
END;
$$;

-- 5. Add unique index on slug column
CREATE UNIQUE INDEX IF NOT EXISTS vendors_slug_idx ON vendors (slug);

-- 6. Enforce NOT NULL constraint once populated
ALTER TABLE vendors ALTER COLUMN slug SET NOT NULL;
