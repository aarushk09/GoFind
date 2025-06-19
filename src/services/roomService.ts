import { supabase } from '@/lib/supabase'
import { Room, CreateRoomData } from '@/types/room'
import { generateRoomCode } from '@/utils/roomCode'

/**
 * Creates a new room with a unique room code
 */
export async function createRoom(hostId: string, hostEmail: string, roomData: CreateRoomData = {}): Promise<{ room?: Room; error?: string }> {
  try {
    let roomCode: string
    let attempts = 0
    const maxAttempts = 10

    // Generate a unique room code
    do {
      roomCode = generateRoomCode()
      attempts++
      
      if (attempts > maxAttempts) {
        return { error: 'Failed to generate unique room code. Please try again.' }
      }

      // Check if room code already exists
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('room_code')
        .eq('room_code', roomCode)
        .eq('status', 'waiting')
        .single()

      if (!existingRoom) {
        break // Room code is unique
      }
    } while (attempts <= maxAttempts)    // Create the room
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        room_code: roomCode,
        host_id: hostId,
        host_email: hostEmail,
        status: 'waiting',
        metadata: {
          title: roomData.title || 'AI Scavenger Hunt',
          description: roomData.description || 'An exciting AI-powered scavenger hunt',
          max_players: roomData.max_players || 50,
          time_limit: roomData.time_limit || 30
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating room:', error)
      
      // Provide more specific error messages
      if (error.code === '42P01') {
        return { error: 'Database table not found. Please ensure the rooms table is created in Supabase.' }
      } else if (error.code === '23505') {
        return { error: 'Room code already exists. Please try again.' }
      } else if (error.message?.includes('JWT')) {
        return { error: 'Authentication error. Please log in again.' }
      } else if (error.message?.includes('RLS')) {
        return { error: 'Permission denied. Please check your account permissions.' }
      }
      
      return { error: `Failed to create room: ${error.message}` }
    }

    return { room: data as Room }
  } catch (error) {
    console.error('Unexpected error creating room:', error)
    return { error: 'An unexpected error occurred while creating the room.' }
  }
}

/**
 * Gets a room by room code
 */
export async function getRoomByCode(roomCode: string): Promise<{ room?: Room; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { error: 'Room not found' }
      }
      return { error: 'Failed to find room' }
    }

    return { room: data as Room }
  } catch (error) {
    console.error('Unexpected error getting room:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Gets all rooms for a specific host
 */
export async function getHostRooms(hostId: string): Promise<{ rooms?: Room[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting host rooms:', error)
      return { error: 'Failed to load your rooms' }
    }

    return { rooms: data as Room[] }
  } catch (error) {
    console.error('Unexpected error getting host rooms:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Updates room status
 */
export async function updateRoomStatus(roomCode: string, status: Room['status'], hostId: string): Promise<{ room?: Room; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('room_code', roomCode)
      .eq('host_id', hostId)
      .select()
      .single()

    if (error) {
      console.error('Error updating room status:', error)
      return { error: 'Failed to update room status' }
    }

    return { room: data as Room }
  } catch (error) {
    console.error('Unexpected error updating room status:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Deletes a room (only if host owns it and it's not active)
 */
export async function deleteRoom(roomCode: string, hostId: string): Promise<{ error?: string }> {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('room_code', roomCode)
      .eq('host_id', hostId)
      .in('status', ['waiting', 'completed', 'cancelled'])

    if (error) {
      console.error('Error deleting room:', error)
      return { error: 'Failed to delete room' }
    }

    return {}
  } catch (error) {
    console.error('Unexpected error deleting room:', error)
    return { error: 'An unexpected error occurred' }
  }
}
