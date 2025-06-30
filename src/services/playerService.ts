import { supabase } from '@/lib/supabase'
import { Player, PlayerProgress, HuntChallenge, LeaderboardEntry } from '@/types/room'
import { AvatarId } from '../components/avatars/AvatarTypes'

/**
 * Joins a player to a room with avatar selection
 */
export async function joinRoom(
  roomCode: string, 
  playerName: string, 
  playerEmail?: string,
  avatarId?: AvatarId,
  metadata?: Player['metadata']
): Promise<{ player?: Player; error?: string }> {
  try {
    // Check if room exists and is accepting players
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .single()

    if (roomError || !room) {
      return { error: 'Room not found' }
    }

    if (room.status !== 'waiting') {
      return { error: 'Room is not accepting new players' }
    }

    // Check current player count
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact' })
      .eq('room_code', roomCode.toUpperCase())
      .eq('status', 'joined')

    const maxPlayers = room.metadata?.max_players || 50
    if (count && count >= maxPlayers) {
      return { error: 'Room is full' }
    }

    // Create player record
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        room_code: roomCode.toUpperCase(),
        player_name: playerName,
        player_email: playerEmail,
        score: 0,
        status: 'joined',
        metadata: {
          avatar_id: avatarId,
          device_type: metadata?.device_type || 'desktop',
          location: metadata?.location,
          preferences: metadata?.preferences || {
            notifications: true,
            sound_effects: true,
            dark_mode: false
          }
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error joining room:', error)
      return { error: 'Failed to join room' }
    }

    // Log activity
    await logRoomActivity(roomCode.toUpperCase(), player.id, 'player_joined', {
      player_name: playerName,
      avatar_id: avatarId
    })

    return { player: player as Player }
  } catch (error) {
    console.error('Unexpected error joining room:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Gets all players in a room
 */
export async function getRoomPlayers(roomCode: string): Promise<{ players?: Player[]; error?: string }> {
import { supabase } from '@/lib/supabase';
import { Player } from '@/types/player';

export async function joinRoom(room_code: string, player_name: string): Promise<{ player?: Player; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert({
        room_code,
        player_name,
        status: 'joined',
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) {
      return { error: error.message };
    }
    return { player: data as Player };
  } catch (error) {
    return { error: 'An unexpected error occurred while joining the room.' };
  }
}

export async function getPlayersInRoom(room_code: string): Promise<{ players?: Player[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('room_code', roomCode.toUpperCase())
      .order('score', { ascending: false })

    if (error) {
      console.error('Error getting room players:', error)
      return { error: 'Failed to load players' }
    }

    return { players: data as Player[] }
  } catch (error) {
    console.error('Unexpected error getting players:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Updates player information
 */
export async function updatePlayer(
  playerId: string, 
  updates: Partial<Player>
): Promise<{ player?: Player; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', playerId)
      .select()
      .single()

    if (error) {
      console.error('Error updating player:', error)
      return { error: 'Failed to update player' }
    }

    return { player: data as Player }
  } catch (error) {
    console.error('Unexpected error updating player:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Updates player avatar
 */
export async function updatePlayerAvatar(
  playerId: string, 
  avatarId: AvatarId
): Promise<{ player?: Player; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .update({
        metadata: supabase.rpc('jsonb_set', {
          target: supabase.raw('metadata'),
          path: '{avatar_id}',
          new_value: JSON.stringify(avatarId)
        })
      })
      .eq('id', playerId)
      .select()
      .single()

    if (error) {
      console.error('Error updating player avatar:', error)
      return { error: 'Failed to update avatar' }
    }

    return { player: data as Player }
  } catch (error) {
    console.error('Unexpected error updating avatar:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Removes a player from a room
 */
export async function leaveRoom(playerId: string): Promise<{ error?: string }> {
  try {
    // Get player info before deletion for activity logging
    const { data: player } = await supabase
      .from('players')
      .select('room_code, player_name')
      .eq('id', playerId)
      .single()

    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId)

    if (error) {
      console.error('Error leaving room:', error)
      return { error: 'Failed to leave room' }
    }

    // Log activity
    if (player) {
      await logRoomActivity(player.room_code, playerId, 'player_left', {
        player_name: player.player_name
      })
    }

    return {}
  } catch (error) {
    console.error('Unexpected error leaving room:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Gets player progress for a specific room
 */
export async function getPlayerProgress(
  playerId: string,
  roomCode?: string
): Promise<{ progress?: PlayerProgress[]; error?: string }> {
  try {
    let query = supabase
      .from('player_progress')
      .select(`
        *,
        hunt_challenges (
          id,
          challenge_order,
          challenge_type,
          challenge_data,
          points
        )
      `)
      .eq('player_id', playerId)

    if (roomCode) {
      query = query.eq('hunt_challenges.room_code', roomCode.toUpperCase())
    }

    const { data, error } = await query.order('hunt_challenges.challenge_order', { ascending: true })

    if (error) {
      console.error('Error getting player progress:', error)
      return { error: 'Failed to load progress' }
    }

    return { progress: data as PlayerProgress[] }
  } catch (error) {
    console.error('Unexpected error getting progress:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Updates player progress on a challenge
 */
export async function updatePlayerProgress(
  playerId: string,
  challengeId: string,
  progressData: Partial<PlayerProgress>
): Promise<{ progress?: PlayerProgress; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('player_progress')
      .upsert({
        player_id: playerId,
        challenge_id: challengeId,
        ...progressData
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
      return { error: 'Failed to update progress' }
    }

    // Update player total score if challenge completed
    if (progressData.status === 'completed' && progressData.points_earned) {
      await supabase.rpc('increment_player_score', {
        player_id: playerId,
        points: progressData.points_earned
      })
    }

    return { progress: data as PlayerProgress }
  } catch (error) {
    console.error('Unexpected error updating progress:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Gets leaderboard for a room
 */
export async function getRoomLeaderboard(
  roomCode: string,
  limit: number = 10
): Promise<{ leaderboard?: LeaderboardEntry[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('id, player_name, score, completed_at, metadata')
      .eq('room_code', roomCode.toUpperCase())
      .order('score', { ascending: false })
      .order('completed_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error getting leaderboard:', error)
      return { error: 'Failed to load leaderboard' }
    }

         // Calculate completion times and add ranks
     const leaderboard: LeaderboardEntry[] = data.map((player, index) => ({
       player_id: player.id,
       player_name: player.player_name,
       avatar_id: player.metadata?.avatar_id,
       score: player.score,
       completion_time: player.completed_at ? 
         new Date(player.completed_at).getTime() - new Date().getTime() : undefined,
       challenges_completed: 0, // This would need to be calculated from progress
       rank: index + 1
     }))

    return { leaderboard }
  } catch (error) {
    console.error('Unexpected error getting leaderboard:', error)
    return { error: 'An unexpected error occurred' }
  }
}

/**
 * Logs room activity for real-time updates
 */
export async function logRoomActivity(
  roomCode: string,
  playerId: string | null,
  activityType: string,
  activityData: any
): Promise<void> {
  try {
    await supabase
      .from('room_activities')
      .insert({
        room_code: roomCode,
        player_id: playerId,
        activity_type: activityType,
        activity_data: activityData,
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error logging room activity:', error)
  }
}

/**
 * Gets recent room activities
 */
export async function getRoomActivities(
  roomCode: string,
  limit: number = 20
): Promise<{ activities?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('room_activities')
      .select(`
        *,
        players (
          player_name,
          metadata
        )
      `)
      .eq('room_code', roomCode.toUpperCase())
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting room activities:', error)
      return { error: 'Failed to load activities' }
    }

    return { activities: data }
  } catch (error) {
    console.error('Unexpected error getting activities:', error)
    return { error: 'An unexpected error occurred' }
  }
} 
      .eq('room_code', room_code)
      .order('joined_at', { ascending: true });
    if (error) {
      return { error: error.message };
    }
    return { players: data as Player[] };
  } catch (error) {
    return { error: 'An unexpected error occurred while fetching players.' };
  }
}
