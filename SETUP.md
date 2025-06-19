# GoFind Database Setup Guide

## Setting up Supabase Database Tables

The application requires several database tables to be created in your Supabase project. Follow these steps:

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Create a new query

### 2. Create the Required Tables

Copy and paste the SQL from `database-schema.sql` file into the SQL editor and run it. This will create:

- `rooms` table - Stores hunt room information
- `players` table - Stores player information (for future implementation)
- `hunt_challenges` table - Stores challenges/clues (for future implementation)
- `player_progress` table - Tracks player progress (for future implementation)

### 3. Enable Row Level Security (RLS)

The schema includes RLS policies that:
- Allow hosts to manage their own rooms
- Allow players to read room information they've joined
- Protect sensitive data from unauthorized access

### 4. Test the Setup

After running the SQL schema:

1. Try creating a room from the application
2. Check the **Table Editor** in Supabase to see if data is being inserted
3. Verify that room codes are being generated correctly

### 5. Troubleshooting

**Error: "Database table not found"**
- Make sure you've run the complete schema SQL
- Check that the `rooms` table exists in your Supabase project

**Error: "Permission denied"**
- Verify that RLS policies are set up correctly
- Make sure you're logged in with a valid user account

**Error: "Room code already exists"**
- This is normal - the system will try again with a new code
- If it persists, there might be an issue with the random code generation

## Quick Start Schema (Minimal)

If you just want to test the room creation feature, you can start with this minimal schema:

```sql
-- Minimal rooms table for testing
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(6) NOT NULL UNIQUE,
    host_id UUID NOT NULL,
    host_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Basic RLS policy
CREATE POLICY "Enable all for authenticated users" ON rooms
    FOR ALL USING (auth.role() = 'authenticated');
```

This minimal setup will allow you to test room creation without the full schema complexity.
