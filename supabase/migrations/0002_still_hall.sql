/*
  # Add Categories and Scheduled Content

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    - `scheduled_content`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `file_id` (text)
      - `category_id` (uuid, foreign key)
      - `publish_at` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)
  
  2. Changes
    - Add category_id to content table
  
  3. Security
    - Enable RLS
    - Add policies for authenticated users and service role
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Scheduled content table
CREATE TABLE IF NOT EXISTS scheduled_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  type text DEFAULT 'text',
  file_id text,
  category_id uuid REFERENCES categories(id),
  publish_at timestamptz NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Add category to content table
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE content ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read for categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access to categories"
  ON categories
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read for scheduled_content"
  ON scheduled_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access to scheduled_content"
  ON scheduled_content
  TO service_role
  USING (true)
  WITH CHECK (true);