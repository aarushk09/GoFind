import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Room, Player, RealTimeUpdate, LeaderboardEntry } from '@/types/room'
import { getRoomPlayers, getRoomLeaderboard, getRoomActivities } from '@/services/playerService'

interface UseRealTimeRoomOptions {
  roomCode: string
  playerId?: string
  isHost?: boolean
  enableActivities?: boolean
  updateInterval?: number
}

interface UseRealTimeRoomReturn {
  // Room state
  room: Room | null
  players: Player[]
  leaderboard: LeaderboardEntry[]
  activities: any[]
  
  // Connection state
  isConnected: boolean
  isLoading: boolean
  error: string | null
  
  // Player counts
  totalPlayers: number
  activePlayers: number
  
     // Actions
   refreshData: () => Promise<void>
   sendUpdate: (update: Partial<RealTimeUpdate>) => void
}

export const useRealTimeRoom = ({
  roomCode,
  playerId,
  isHost = false,
  enableActivities = true,
  updateInterval = 5000
}: UseRealTimeRoomOptions): UseRealTimeRoomReturn => {
  // State
  const [room, setRoom] = useState<Room | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for cleanup
  const subscriptionRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const callbacksRef = useRef<{
    onPlayerJoined?: (player: Player) => void
    onPlayerLeft?: (playerId: string) => void
    onRoomStatusChanged?: (status: Room['status']) => void
  }>({})

  // Load initial data
  const loadRoomData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load room info
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', roomCode.toUpperCase())
        .single()

      if (roomError) {
        throw new Error('Room not found')
      }

      setRoom(roomData as Room)

      // Load players
      const { players: playersData, error: playersError } = await getRoomPlayers(roomCode)
      if (playersError) {
        throw new Error(playersError)
      }
      setPlayers(playersData || [])

      // Load leaderboard
      const { leaderboard: leaderboardData, error: leaderboardError } = await getRoomLeaderboard(roomCode)
      if (leaderboardError) {
        console.warn('Failed to load leaderboard:', leaderboardError)
      } else {
        setLeaderboard(leaderboardData || [])
      }

      // Load activities if enabled
      if (enableActivities) {
        const { activities: activitiesData, error: activitiesError } = await getRoomActivities(roomCode)
        if (activitiesError) {
          console.warn('Failed to load activities:', activitiesError)
        } else {
          setActivities(activitiesData || [])
        }
      }

      setIsConnected(true)
    } catch (err) {
      console.error('Error loading room data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load room data')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [roomCode, enableActivities])

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await loadRoomData()
  }, [loadRoomData])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomCode) return

    loadRoomData()

    // Subscribe to room changes
    const roomSubscription = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `room_code=eq.${roomCode.toUpperCase()}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room
            setRoom(updatedRoom)
            
            // Trigger callback for status changes
            if (payload.old && payload.old.status !== updatedRoom.status) {
              callbacksRef.current.onRoomStatusChanged?.(updatedRoom.status)
            }
          }
        }
      )
      .subscribe()

    // Subscribe to player changes
    const playersSubscription = supabase
      .channel(`players:${roomCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_code=eq.${roomCode.toUpperCase()}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPlayer = payload.new as Player
            setPlayers(prev => [...prev, newPlayer])
            callbacksRef.current.onPlayerJoined?.(newPlayer)
          } else if (payload.eventType === 'DELETE') {
            const deletedPlayer = payload.old as Player
            setPlayers(prev => prev.filter(p => p.id !== deletedPlayer.id))
            callbacksRef.current.onPlayerLeft?.(deletedPlayer.id)
          } else if (payload.eventType === 'UPDATE') {
            const updatedPlayer = payload.new as Player
            setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p))
          }
        }
      )
      .subscribe()

    // Subscribe to activities if enabled
    let activitiesSubscription: any
    if (enableActivities) {
      activitiesSubscription = supabase
        .channel(`activities:${roomCode}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'room_activities',
            filter: `room_code=eq.${roomCode.toUpperCase()}`
          },
          (payload) => {
            const newActivity = payload.new
            setActivities(prev => [newActivity, ...prev.slice(0, 19)]) // Keep last 20
          }
        )
        .subscribe()
    }

    subscriptionRef.current = {
      room: roomSubscription,
      players: playersSubscription,
      activities: activitiesSubscription
    }

    // Set up periodic refresh for leaderboard
    intervalRef.current = setInterval(async () => {
      const { leaderboard: updatedLeaderboard } = await getRoomLeaderboard(roomCode)
      if (updatedLeaderboard) {
        setLeaderboard(updatedLeaderboard)
      }
    }, updateInterval)

    return () => {
             // Cleanup subscriptions
       if (subscriptionRef.current) {
         Object.values(subscriptionRef.current).forEach(sub => {
           if (sub && typeof sub.unsubscribe === 'function') {
             sub.unsubscribe()
           }
         })
       }
      
      // Cleanup interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [roomCode, enableActivities, loadRoomData, updateInterval])

  // Send real-time update
  const sendUpdate = useCallback((update: Partial<RealTimeUpdate>) => {
    const fullUpdate: RealTimeUpdate = {
      type: update.type || 'progress_update',
      data: update.data || {},
      timestamp: new Date().toISOString(),
      room_code: roomCode,
      ...update
    }

    // Broadcast to other clients via Supabase realtime
    supabase
      .channel(`updates:${roomCode}`)
      .send({
        type: 'broadcast',
        event: 'room_update',
        payload: fullUpdate
      })
  }, [roomCode])

  // Calculate derived values
  const totalPlayers = players.length
  const activePlayers = players.filter(p => p.status === 'active' || p.status === 'joined').length

  return {
    // Room state
    room,
    players,
    leaderboard,
    activities,
    
    // Connection state
    isConnected,
    isLoading,
    error,
    
    // Player counts
    totalPlayers,
    activePlayers,
    
    // Actions
    refreshData,
    sendUpdate,
    
         // Actions
     refreshData,
     sendUpdate
  }
} 