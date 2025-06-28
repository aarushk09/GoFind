-- SQL schema for shareable_results table
-- This should be executed in your Supabase database

CREATE TABLE IF NOT EXISTS shareable_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  room_data JSONB NOT NULL,
  game_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_shareable_results_share_token ON shareable_results(share_token);
CREATE INDEX IF NOT EXISTS idx_shareable_results_room_code ON shareable_results(room_code);
CREATE INDEX IF NOT EXISTS idx_shareable_results_created_at ON shareable_results(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE shareable_results ENABLE ROW LEVEL SECURITY;

-- Policy for public read access via share_token (no authentication required)
CREATE POLICY "Public read access via share_token" ON shareable_results
  FOR SELECT
  USING (true);

-- Policy for authenticated users to insert their own results
CREATE POLICY "Users can insert their own shareable results" ON shareable_results
  FOR INSERT
  WITH CHECK (auth.uid()::text = room_data->>'host_id');

-- Policy for authenticated users to delete their own results
CREATE POLICY "Users can delete their own shareable results" ON shareable_results
  FOR DELETE
  USING (auth.uid()::text = room_data->>'host_id');

-- Policy for authenticated users to view their own results
CREATE POLICY "Users can view their own shareable results" ON shareable_results
  FOR SELECT
  USING (auth.uid()::text = room_data->>'host_id');

-- Comments
COMMENT ON TABLE shareable_results IS 'Stores shareable game results that can be accessed publicly via unique tokens';
COMMENT ON COLUMN shareable_results.share_token IS 'Unique token for public access to the results';
COMMENT ON COLUMN shareable_results.room_data IS 'JSON data from the original room record';
COMMENT ON COLUMN shareable_results.game_data IS 'JSON data containing game results, players, and metadata';
