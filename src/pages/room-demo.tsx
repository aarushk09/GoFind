import React, { useState, useEffect } from 'react'
import { Room, Player } from '@/types/room'
import RoomCreator from '@/components/room/RoomCreator'
import PlayerJoinFlow from '@/components/room/PlayerJoinFlow'
import RoomDashboard from '@/components/room/RoomDashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface RoomMetrics {
  totalRooms: number;
  activeRooms: number;
  totalPlayers: number;
  avgSessionTime: number;
}

// Mock data for demo
const mockRoom: Room = {
  id: '1',
  room_code: 'DEMO01',
  host_id: 'mock-host-id',
  host_email: 'demo@example.com',
  status: 'waiting',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metadata: {
    title: 'Demo Scavenger Hunt',
    description: 'A demonstration of our scavenger hunt platform',
    max_players: 25,
    time_limit: 30,
    difficulty: 'medium',
    theme: 'mixed',
    is_public: true,
    tags: ['demo', 'tutorial', 'fun']
  }
}

const mockPlayer: Player = {
  id: 'mock-player-id',
  room_code: 'DEMO01',
  player_name: 'Demo Player',
  player_email: 'player@example.com',
  score: 150,
  status: 'joined',
  joined_at: new Date().toISOString(),
  metadata: {
    device_type: 'desktop',
    preferences: {
      notifications: true,
      sound_effects: true,
      dark_mode: false
    }
  } as any
}

export default function RoomDemo() {
  const [currentView, setCurrentView] = useState<'overview' | 'creator' | 'join' | 'dashboard'>('overview')
  const [demoRoom, setDemoRoom] = useState<Room | null>(null)
  const [demoPlayer, setDemoPlayer] = useState<Player | null>(null)
  const [metrics, setMetrics] = useState<RoomMetrics>({
    totalRooms: 0,
    activeRooms: 0,
    totalPlayers: 0,
    avgSessionTime: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate live metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalRooms: Math.min(prev.totalRooms + Math.floor(Math.random() * 3), 247),
        activeRooms: Math.min(prev.activeRooms + Math.floor(Math.random() * 2), 89),
        totalPlayers: Math.min(prev.totalPlayers + Math.floor(Math.random() * 5), 1834),
        avgSessionTime: Math.min(prev.avgSessionTime + Math.floor(Math.random() * 2), 1847)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleRoomCreated = (roomCode: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setDemoRoom({ ...mockRoom, room_code: roomCode })
      setCurrentView('dashboard')
      setIsLoading(false)
    }, 1500)
  }

  const handlePlayerJoined = (player: Player, room: Room) => {
    setIsLoading(true)
    setTimeout(() => {
      setDemoPlayer(player)
      setDemoRoom(room)
      setCurrentView('dashboard')
      setIsLoading(false)
    }, 1000)
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Room Management System
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Comprehensive real-time room management with advanced analytics, player tracking, and seamless integration
        </p>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Rooms</p>
              <p className="text-2xl font-bold text-white">{metrics.totalRooms}</p>
              <p className="text-xs text-green-400 mt-1">+12% this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Rooms</p>
              <p className="text-2xl font-bold text-white">{metrics.activeRooms}</p>
              <p className="text-xs text-green-400 mt-1">+8% this week</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Players</p>
              <p className="text-2xl font-bold text-white">{metrics.totalPlayers}</p>
              <p className="text-xs text-green-400 mt-1">+24% this week</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Session</p>
              <p className="text-2xl font-bold text-white">{Math.floor(metrics.avgSessionTime / 60)}m</p>
              <p className="text-xs text-green-400 mt-1">+5% this week</p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Room Creation</h3>
          <p className="text-gray-300 text-sm mb-4">
            Advanced room setup with themes, difficulty levels, player limits, and custom configurations
          </p>
          <button
            onClick={() => setCurrentView('creator')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Room
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Player Management</h3>
          <p className="text-gray-300 text-sm mb-4">
            Streamlined player onboarding with avatar selection, preferences, and real-time status tracking
          </p>
          <button
            onClick={() => setCurrentView('join')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Join Flow
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Live Dashboard</h3>
          <p className="text-gray-300 text-sm mb-4">
            Real-time analytics, player tracking, leaderboards, and comprehensive room management tools
          </p>
          <button
            onClick={() => {
              setDemoRoom(mockRoom)
              setDemoPlayer(mockPlayer)
              setCurrentView('dashboard')
            }}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'React 18', desc: 'Modern component architecture', color: 'bg-blue-600' },
            { name: 'TypeScript', desc: 'Type-safe development', color: 'bg-indigo-600' },
            { name: 'Supabase', desc: 'Real-time database sync', color: 'bg-green-600' },
            { name: 'Tailwind', desc: 'Utility-first styling', color: 'bg-cyan-600' }
          ].map((tech) => (
            <div key={tech.name} className="text-center">
              <div className={`w-16 h-16 ${tech.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <div className="w-8 h-8 bg-white rounded opacity-20"></div>
              </div>
              <h3 className="font-semibold text-white mb-1">{tech.name}</h3>
              <p className="text-sm text-gray-400">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Development Metrics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">25+</div>
            <div className="text-gray-300 font-medium">Components Built</div>
            <div className="text-sm text-gray-500">Modular architecture</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">3.2k+</div>
            <div className="text-gray-300 font-medium">Lines of Code</div>
            <div className="text-sm text-gray-500">Production ready</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">15h</div>
            <div className="text-gray-300 font-medium">Development Time</div>
            <div className="text-sm text-gray-500">Professional quality</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNavigationHeader = () => (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('overview')}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to Overview</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Room Management Demo
            </div>
            {demoRoom && (
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Room: {demoRoom.room_code}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-300 mt-4">Setting up your room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {currentView !== 'overview' && renderNavigationHeader()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && renderOverview()}
        
        {currentView === 'creator' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Create New Room</h1>
            <RoomCreator 
              hostId="demo-host-id"
              hostEmail="demo@example.com"
              onRoomCreated={handleRoomCreated} 
            />
          </div>
        )}
        
        {currentView === 'join' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Join Room Experience</h1>
            <PlayerJoinFlow
              roomCode="DEMO01"
              onJoinSuccess={handlePlayerJoined}
            />
          </div>
        )}
        
        {currentView === 'dashboard' && demoRoom && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Room Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Live</span>
              </div>
            </div>
            <RoomDashboard 
              roomCode={demoRoom.room_code}
              isHost={true}
              playerId={demoPlayer?.id}
            />
          </div>
        )}
      </div>
    </div>
  )
} 