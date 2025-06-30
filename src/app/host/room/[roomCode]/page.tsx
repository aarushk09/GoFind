'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getRoomByCode, updateRoomStatus } from '@/services/roomService'
import { getPlayersInRoom } from '@/services/playerService'
import { formatRoomCode } from '@/utils/roomCode'
import { Room } from '@/types/room'
import { Player } from '@/types/player'

export default function RoomLobbyPage() {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)
  const [playersError, setPlayersError] = useState<string | null>(null)
  
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const roomCode = params.roomCode as string

  // Function to load players
  const loadPlayers = async () => {
    if (!roomCode) return
    
    setPlayersLoading(true)
    setPlayersError(null)
    
    try {
      const result = await getPlayersInRoom(roomCode)
      if (result.error) {
        setPlayersError(result.error)
        console.error('Error loading players:', result.error)
      } else if (result.players) {
        setPlayers(result.players)
        console.log(`📋 Loaded ${result.players.length} players for room ${roomCode}`)
      }
    } catch (error) {
      console.error('Error loading players:', error)
      setPlayersError('Failed to load players')
    } finally {
      setPlayersLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const loadRoom = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getRoomByCode(roomCode)
        
        if (result.error) {
          setError(result.error)
        } else if (result.room) {
          // Check if current user is the host
          if (result.room.host_id !== user?.id) {
            setError('You are not the host of this room')
            return
          }
          setRoom(result.room)
          
          // Load players after room is loaded
          loadPlayers()
        }
      } catch (error) {
        console.error('Error loading room:', error)
        setError('Failed to load room')
      } finally {
        setLoading(false)
      }
    }

    loadRoom()
  }, [user, roomCode, router])

  // Auto-refresh players every 5 seconds
  useEffect(() => {
    if (!room) return

    const interval = setInterval(() => {
      loadPlayers()
    }, 5000)

    return () => clearInterval(interval)
  }, [room, roomCode])

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy room code:', error)
    }
  }

  const shareRoomCode = async () => {
    const shareData = {
      title: 'Join my AI Scavenger Hunt!',
      text: `Use room code ${roomCode} to join the hunt`,
      url: `${window.location.origin}/join/${roomCode}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copying
      copyRoomCode()
    }
  }

  const startHunt = async () => {
    if (!room) return

    try {
      const result = await updateRoomStatus(room.room_code, 'active', user!.id)
      if (result.error) {
        setError(result.error)
      } else {
        // Navigate to active hunt management
        router.push(`/host/room/${roomCode}/active`)
      }
    } catch (error) {
      console.error('Error starting hunt:', error)
      setError('Failed to start hunt')
    }
  }

  const cancelHunt = async () => {
    if (!room) return

    if (confirm('Are you sure you want to cancel this hunt? This action cannot be undone.')) {
      try {
        const result = await updateRoomStatus(room.room_code, 'cancelled', user!.id)
        if (result.error) {
          setError(result.error)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error cancelling hunt:', error)
        setError('Failed to cancel hunt')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Room Error</h3>
            <p className="mt-2 text-sm text-gray-500">{error || 'Room not found'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.metadata?.title}</h1>
              <p className="text-sm text-gray-500">Host: {room.host_email}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelHunt}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel Hunt
              </button>
              <button
                onClick={startHunt}
                disabled={players.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Hunt
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Code Display */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Room Code
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl font-bold text-blue-600 tracking-wider font-mono">
                        {formatRoomCode(room.room_code)}
                      </div>
                      <p className="text-gray-600">
                        Share this code with players to join your hunt
                      </p>
                      
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={copyRoomCode}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                        
                        <button
                          onClick={shareRoomCode}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Players can join at{' '}
                      <span className="font-medium text-gray-900">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/join
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Settings & Players */}
            <div className="space-y-6">
              {/* Room Settings */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Hunt Settings
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="text-sm text-gray-900">{room.metadata?.description}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Max Players</dt>
                      <dd className="text-sm text-gray-900">{room.metadata?.max_players}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Time Limit</dt>
                      <dd className="text-sm text-gray-900">{room.metadata?.time_limit} minutes</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {room.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Players List */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Players ({players.length}/{room.metadata?.max_players})
                    </h3>
                    <button
                      onClick={loadPlayers}
                      disabled={playersLoading}
                      className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                    >
                      {playersLoading ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {playersError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 text-sm">{playersError}</p>
                    </div>
                  )}
                  
                  {players.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Waiting for players to join...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Share the room code to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {player.player_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{player.player_name}</p>
                              <p className="text-xs text-gray-500">
                                Joined {new Date(player.joined_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              player.status === 'joined' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {player.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {players.length > 0 && (
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Auto-refreshing every 5 seconds
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
