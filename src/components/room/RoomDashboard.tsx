import React, { useState, useEffect } from 'react'
import { Room, Player, LeaderboardEntry } from '@/types/room'
import { useRealTimeRoom } from '@/hooks/useRealTimeRoom'
import { updateRoomStatus } from '@/services/roomService'
import { AvatarDisplay } from '../avatars/AvatarDisplay'
import { AvatarId } from '../avatars/AvatarTypes'

interface RoomDashboardProps {
  roomCode: string
  isHost?: boolean
  playerId?: string
  onRoomStatusChange?: (status: Room['status']) => void
}

export const RoomDashboard: React.FC<RoomDashboardProps> = ({
  roomCode,
  isHost = false,
  playerId,
  onRoomStatusChange
}) => {
  const {
    room,
    players,
    leaderboard,
    activities,
    isConnected,
    isLoading,
    error,
    totalPlayers,
    activePlayers,
    refreshData,
    sendUpdate
  } = useRealTimeRoom({
    roomCode,
    playerId,
    isHost,
    enableActivities: true
  })

  const [selectedTab, setSelectedTab] = useState<'overview' | 'players' | 'leaderboard' | 'activities'>('overview')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Handle room status changes
  const handleStatusChange = async (newStatus: Room['status']) => {
    if (!isHost || !room) return

    setIsUpdatingStatus(true)
    try {
      const result = await updateRoomStatus(roomCode, newStatus, room.host_id)
      if (result.error) {
        console.error('Failed to update room status:', result.error)
      } else {
        sendUpdate({
          type: 'room_status_change',
          data: { status: newStatus, timestamp: new Date().toISOString() }
        })
        onRoomStatusChange?.(newStatus)
      }
    } catch (error) {
      console.error('Error updating room status:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={refreshData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Room Not Found</h3>
        <p className="text-yellow-600">The room "{roomCode}" could not be found.</p>
      </div>
    )
  }

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Room Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{room.metadata?.title || 'Untitled Hunt'}</h2>
            <p className="text-gray-600">{room.metadata?.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(room.status)}`}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalPlayers}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activePlayers}</div>
            <div className="text-sm text-gray-600">Active Players</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{room.metadata?.difficulty || 'Medium'}</div>
            <div className="text-sm text-gray-600">Difficulty</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{room.metadata?.time_limit || 30}m</div>
            <div className="text-sm text-gray-600">Time Limit</div>
          </div>
        </div>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Host Controls</h3>
          <div className="flex space-x-3">
            {room.status === 'waiting' && (
              <button
                onClick={() => handleStatusChange('active')}
                disabled={isUpdatingStatus || totalPlayers === 0}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  totalPlayers > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isUpdatingStatus ? 'Starting...' : 'Start Hunt'}
              </button>
            )}
            
            {room.status === 'active' && (
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdatingStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isUpdatingStatus ? 'Ending...' : 'End Hunt'}
              </button>
            )}
            
            {(room.status === 'waiting' || room.status === 'active') && (
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdatingStatus}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {isUpdatingStatus ? 'Cancelling...' : 'Cancel Hunt'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected to room' : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={refreshData}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )

  const renderPlayers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Players ({totalPlayers})</h3>
        <div className="text-sm text-gray-600">
          {activePlayers} active • {totalPlayers - activePlayers} waiting
        </div>
      </div>
      
      <div className="grid gap-4">
        {players.map((player) => (
          <div key={player.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                 <AvatarDisplay
                   avatarId={((player.metadata as any)?.avatar_id as AvatarId) || 'explorer'}
                   size={50}
                   variant="simple"
                 />
                <div>
                  <h4 className="font-medium text-gray-900">{player.player_name}</h4>
                                     <div className="flex items-center space-x-2 text-sm text-gray-600">
                     <span className={`px-2 py-1 rounded-full text-xs ${
                       player.status === 'joined' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                       player.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                       player.status === 'completed' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                       'bg-gray-100 text-gray-800 border-gray-200'
                     }`}>
                       {player.status}
                     </span>
                    <span>Score: {player.score}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-500">
                <div>Joined {new Date(player.joined_at).toLocaleTimeString()}</div>
                {player.metadata?.device_type && (
                  <div className="capitalize">{player.metadata.device_type}</div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {players.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No players have joined yet
          </div>
        )}
      </div>
    </div>
  )

  const renderLeaderboard = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
      
      <div className="bg-white rounded-lg shadow-sm border">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.player_id}
            className={`flex items-center justify-between p-4 ${
              index < leaderboard.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {entry.rank}
              </div>
              
              <AvatarDisplay
                avatarId={entry.avatar_id || 'explorer'}
                size={40}
                variant="simple"
              />
              
              <div>
                <h4 className="font-medium text-gray-900">{entry.player_name}</h4>
                <div className="text-sm text-gray-600">
                  {entry.challenges_completed} challenges completed
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{entry.score}</div>
              {entry.completion_time && (
                <div className="text-sm text-gray-600">
                  {Math.round(entry.completion_time / 1000 / 60)}m
                </div>
              )}
            </div>
          </div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No scores yet
          </div>
        )}
      </div>
    </div>
  )

  const renderActivities = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="bg-white rounded-lg shadow-sm border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  activity.activity_type === 'player_joined' ? 'bg-green-500' :
                  activity.activity_type === 'player_left' ? 'bg-red-500' :
                  activity.activity_type === 'challenge_completed' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-sm text-gray-900">
                  {activity.activity_type === 'player_joined' && `${activity.activity_data?.player_name} joined the room`}
                  {activity.activity_type === 'player_left' && `${activity.activity_data?.player_name} left the room`}
                  {activity.activity_type === 'challenge_completed' && `${activity.players?.player_name} completed a challenge`}
                  {activity.activity_type === 'room_started' && 'Hunt started'}
                  {activity.activity_type === 'room_ended' && 'Hunt ended'}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Room {roomCode}</h1>
        <div className="text-gray-600">
          {isHost ? 'You are hosting this room' : 'You are a participant'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'players', label: `Players (${totalPlayers})` },
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'activities', label: 'Activity' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'players' && renderPlayers()}
        {selectedTab === 'leaderboard' && renderLeaderboard()}
        {selectedTab === 'activities' && renderActivities()}
      </div>
    </div>
  )
}

export default RoomDashboard 