-- GoFind AI Scavenger Hunt Database Schema
-- This file documents the Supabase database structure needed for the application

-- Rooms table: Stores hunt room information
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(6) NOT NULL UNIQUE,
    host_id UUID NOT NULL,
    host_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_host_id ON rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at);

-- Players table: Stores player information and room participation
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(6) NOT NULL REFERENCES rooms(room_code) ON DELETE CASCADE,
    player_name VARCHAR(100) NOT NULL,
    player_email VARCHAR(255),
    score INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'joined' CHECK (status IN ('joined', 'active', 'completed', 'disconnected')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for players table
CREATE INDEX IF NOT EXISTS idx_players_room_code ON players(room_code);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
CREATE INDEX IF NOT EXISTS idx_players_score ON players(score DESC);

-- Hunt challenges table: Stores the challenges/clues for each hunt
CREATE TABLE IF NOT EXISTS hunt_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(6) NOT NULL REFERENCES rooms(room_code) ON DELETE CASCADE,
    challenge_order INTEGER NOT NULL,
    challenge_type VARCHAR(50) NOT NULL CHECK (challenge_type IN ('photo', 'text', 'location', 'qr_code', 'ai_prompt')),
    challenge_data JSONB NOT NULL,
    ai_prompt TEXT,
    correct_answer TEXT,
    points INTEGER DEFAULT 10,
    time_limit_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for hunt_challenges table
CREATE INDEX IF NOT EXISTS idx_hunt_challenges_room_code ON hunt_challenges(room_code);
CREATE INDEX IF NOT EXISTS idx_hunt_challenges_order ON hunt_challenges(room_code, challenge_order);

-- Player progress table: Tracks individual player progress through challenges
CREATE TABLE IF NOT EXISTS player_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES hunt_challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    submitted_answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    submission_data JSONB DEFAULT '{}'
);

-- Create indexes for player_progress table
CREATE INDEX IF NOT EXISTS idx_player_progress_player_id ON player_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_player_progress_challenge_id ON player_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_player_progress_status ON player_progress(status);

-- Create unique constraint to prevent duplicate progress entries
ALTER TABLE player_progress ADD CONSTRAINT unique_player_challenge 
UNIQUE (player_id, challenge_id);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE hunt_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms table
CREATE POLICY "Hosts can manage their own rooms" ON rooms
    FOR ALL USING (auth.uid()::uuid = host_id);

CREATE POLICY "Anyone can read room basic info by room code" ON rooms
    FOR SELECT USING (true);

-- RLS Policies for players table  
CREATE POLICY "Players can read players in their room" ON players
    FOR SELECT USING (
        room_code IN (
            SELECT room_code FROM rooms WHERE auth.uid()::uuid = host_id
            UNION
            SELECT room_code FROM players WHERE auth.uid()::uuid = id
        )
    );

CREATE POLICY "Anyone can insert as player" ON players
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Players can update their own data" ON players
    FOR UPDATE USING (auth.uid()::uuid = id);

-- RLS Policies for hunt_challenges table
CREATE POLICY "Hosts can manage challenges in their rooms" ON hunt_challenges
    FOR ALL USING (
        room_code IN (SELECT room_code FROM rooms WHERE auth.uid()::uuid = host_id)
    );

CREATE POLICY "Players can read challenges in their room" ON hunt_challenges
    FOR SELECT USING (
        room_code IN (SELECT room_code FROM players WHERE auth.uid()::uuid = id)
    );

-- RLS Policies for player_progress table
CREATE POLICY "Players can manage their own progress" ON player_progress
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE auth.uid()::uuid = id)
    );

CREATE POLICY "Hosts can read progress in their rooms" ON player_progress
    FOR SELECT USING (
        challenge_id IN (
            SELECT hc.id FROM hunt_challenges hc
            JOIN rooms r ON hc.room_code = r.room_code
            WHERE auth.uid()::uuid = r.host_id
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for rooms table
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO rooms (room_code, host_id, host_email, metadata) VALUES 
-- ('TEST01', 'sample-uuid', 'host@example.com', '{"title": "Test Hunt", "description": "A test scavenger hunt", "max_players": 25, "time_limit": 30}');
