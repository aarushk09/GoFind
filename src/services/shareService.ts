import { supabase } from '@/lib/supabase'
import { Room } from '@/types/room'

export interface ShareableGameResult {
  id: string
  room_code: string
  title: string
  description: string
  date: string
  duration: string
  status: 'completed' | 'cancelled'
  host_name: string
  players: {
    id: string
    name: string
    score: number
    avatar?: string
    completion_time?: string
  }[]
  share_token: string
  created_at: string
}

/**
 * Generate a unique share token
 */
function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Create a shareable link for a completed game
 */
export async function createShareableResult(
  roomCode: string, 
  hostId: string,
  gameData: {
    players: ShareableGameResult['players']
    duration: string
    host_name: string
  }
): Promise<{ shareToken?: string; shareUrl?: string; error?: string }> {
  try {
    // First, get the room data
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode)
      .eq('host_id', hostId)
      .eq('status', 'completed')
      .single()

    if (roomError || !room) {
      return { error: 'Room not found or not completed' }
    }

    const shareToken = generateShareToken()

    // Store the shareable result
    const { data, error } = await supabase
      .from('shareable_results')
      .insert({
        room_code: roomCode,
        share_token: shareToken,
        room_data: room,
        game_data: gameData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating shareable result:', error)
      return { error: 'Failed to create shareable link' }
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/share/${shareToken}`

    return { 
      shareToken,
      shareUrl
    }
  } catch (error) {
    console.error('Unexpected error creating shareable result:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get shareable result by token (public access)
 */
export async function getShareableResult(shareToken: string): Promise<{ result?: ShareableGameResult; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('shareable_results')
      .select('*')
      .eq('share_token', shareToken)
      .single()

    if (error || !data) {
      return { error: 'Shared result not found' }
    }

    // Transform the data into our expected format
    const result: ShareableGameResult = {
      id: data.id,
      room_code: data.room_code,
      title: data.room_data.metadata?.title || 'AI Scavenger Hunt',
      description: data.room_data.metadata?.description || '',
      date: data.room_data.created_at,
      duration: data.game_data.duration,
      status: data.room_data.status,
      host_name: data.game_data.host_name,
      players: data.game_data.players || [],
      share_token: data.share_token,
      created_at: data.created_at
    }

    return { result }
  } catch (error) {
    console.error('Unexpected error getting shareable result:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get all shareable results for a host
 */
export async function getHostShareableResults(hostId: string): Promise<{ results?: ShareableGameResult[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('shareable_results')
      .select('*')
      .eq('room_data->>host_id', hostId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting host shareable results:', error)
      return { error: 'Failed to load shareable results' }
    }

    const results: ShareableGameResult[] = data.map(item => ({
      id: item.id,
      room_code: item.room_code,
      title: item.room_data.metadata?.title || 'AI Scavenger Hunt',
      description: item.room_data.metadata?.description || '',
      date: item.room_data.created_at,
      duration: item.game_data.duration,
      status: item.room_data.status,
      host_name: item.game_data.host_name,
      players: item.game_data.players || [],
      share_token: item.share_token,
      created_at: item.created_at
    }))

    return { results }
  } catch (error) {
    console.error('Unexpected error getting host shareable results:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Delete a shareable result
 */
export async function deleteShareableResult(shareToken: string, hostId: string): Promise<{ error?: string }> {
  try {
    const { error } = await supabase
      .from('shareable_results')
      .delete()
      .eq('share_token', shareToken)
      .eq('room_data->>host_id', hostId)

    if (error) {
      console.error('Error deleting shareable result:', error)
      return { error: 'Failed to delete shareable result' }
    }

    return {}
  } catch (error) {
    console.error('Unexpected error deleting shareable result:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Get demo shareable result for testing (doesn't require database)
 */
export function getDemoShareableResult(): ShareableGameResult {
  return {
    id: 'demo-123',
    room_code: 'DEMO123',
    title: 'AI Treasure Hunt Demo',
    description: 'A demonstration of the AI-powered scavenger hunt featuring various challenges and puzzles.',
    date: '2025-06-27',
    duration: '23m 45s',
    status: 'completed',
    host_name: 'Demo Host',
    players: [
      { id: '1', name: 'Alex Champion', score: 950, avatar: 'gofind_1', completion_time: '22m 15s' },
      { id: '2', name: 'Maria Explorer', score: 820, avatar: 'gofind_2', completion_time: '23m 02s' },
      { id: '3', name: 'Sam Adventurer', score: 780, completion_time: '23m 30s' },
      { id: '4', name: 'Lisa Detective', score: 720, avatar: 'gofind_1', completion_time: '23m 45s' },
      { id: '5', name: 'Mike Hunter', score: 680, completion_time: '24m 10s' },
      { id: '6', name: 'Emma Seeker', score: 650, avatar: 'gofind_2', completion_time: '24m 30s' },
      { id: '7', name: 'John Finder', score: 620, completion_time: '25m 00s' },
      { id: '8', name: 'Sarah Scout', score: 590, completion_time: '25m 20s' }
    ],
    share_token: 'demo123abc456def789',
    created_at: '2025-06-27T10:00:00Z'
  }
}
