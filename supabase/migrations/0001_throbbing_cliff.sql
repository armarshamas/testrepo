/*
  # Initial Schema Setup for Telegram Bot

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `telegram_id` (bigint, unique)
      - `username` (text)
      - `is_subscribed` (boolean)
      - `created_at` (timestamp)
    - `content`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `file_id` (text)
      - `created_at` (timestamp)
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint UNIQUE NOT NULL,
  username text,
  is_subscribed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  type text DEFAULT 'text',
  file_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read for users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read for content"
  ON content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access to users"
  ON users
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to content"
  ON content
  TO service_role
  USING (true)
  WITH CHECK (true);