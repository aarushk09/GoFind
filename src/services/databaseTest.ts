import { supabase } from '@/lib/supabase'

/**
 * Simple test function to check if database is properly configured
 */
export async function testDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Try to query the rooms table
    const { data, error } = await supabase
      .from('rooms')
      .select('id')
      .limit(1)

    if (error) {
      if (error.code === '42P01') {
        return { 
          success: false, 
          error: 'The rooms table does not exist. Please run the database schema setup.' 
        }
      }
      return { 
        success: false, 
        error: `Database error: ${error.message}` 
      }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: `Connection error: ${error}` 
    }
  }
}

/**
 * Creates the rooms table if it doesn't exist (for development/testing)
 */
export async function createRoomsTableIfNotExists(): Promise<{ success: boolean; error?: string }> {
  try {
    // This is a simplified version for testing
    const createTableSQL = `
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
      
      ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Enable all for authenticated users" ON rooms
        FOR ALL USING (auth.role() = 'authenticated');
    `

    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (error) {
      return { 
        success: false, 
        error: `Failed to create table: ${error.message}` 
      }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: `Error creating table: ${error}` 
    }
  }
}









