import React, { useState } from 'react'
import { Room, Player } from '@/types/room'
import RoomCreator from '@/components/room/RoomCreator'
import PlayerJoinFlow from '@/components/room/PlayerJoinFlow'
import RoomDashboard from '@/components/room/RoomDashboard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

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

  const handleRoomCreated = (roomCode: string) => {
    setDemoRoom({ ...mockRoom, room_code: roomCode })
    setCurrentView('dashboard')
  }

  const handlePlayerJoined = (player: Player, room: Room) => {
    setDemoPlayer(player)
    setDemoRoom(room)
    setCurrentView('dashboard')
  }

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Room Management Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore our comprehensive room management system with real-time features
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Room Creation</h3>
          <p className="text-gray-600 text-sm mb-4">
            Create customized rooms with themes, difficulty levels, and player limits
          </p>
          <button
            onClick={() => setCurrentView('creator')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Room Creator
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Player Join Flow</h3>
          <p className="text-gray-600 text-sm mb-4">
            Streamlined player onboarding with avatar selection and preferences
          </p>
          <button
            onClick={() => setCurrentView('join')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Try Join Flow
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Dashboard</h3>
          <p className="text-gray-600 text-sm mb-4">
            Real-time room management with player tracking and leaderboards
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

      {/* Technology Stack */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'React 18', desc: 'Modern UI framework with hooks', icon: '⚛️' },
            { name: 'TypeScript', desc: 'Type-safe development', icon: '📘' },
            { name: 'Supabase', desc: 'Real-time database & auth', icon: '🗄️' },
            { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: '🎨' }
          ].map((tech) => (
            <div key={tech.name} className="text-center">
              <div className="text-3xl mb-2">{tech.icon}</div>
              <h3 className="font-semibold text-gray-900">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Real-time player tracking',
            'Avatar integration system',
            'Multi-step room creation',
            'Live leaderboards',
            'Activity feed monitoring',
            'Responsive design',
            'Accessibility support',
            'Dark mode compatibility',
            'Mobile optimization',
            'Type-safe development',
            'Advanced animations',
            'State management hooks'
          ].map((feature) => (
            <div key={feature} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600">18+</div>
          <div className="text-sm text-gray-600">Components Created</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600">2000+</div>
          <div className="text-sm text-gray-600">Lines of Code</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600">10h</div>
          <div className="text-sm text-gray-600">Development Time</div>
        </div>
      </div>
    </div>
  )

  const renderNavigationHeader = () => (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('overview')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Overview
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentView === 'creator' && 'Room Creator'}
              {currentView === 'join' && 'Player Join Flow'}
              {currentView === 'dashboard' && 'Room Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <LoadingSpinner size="sm" variant="dots" color="blue" />
            <span className="text-sm text-gray-500">Live Demo</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {currentView !== 'overview' && renderNavigationHeader()}
      
      <div className="py-8">
        {currentView === 'overview' && renderOverview()}
        
        {currentView === 'creator' && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Creator Demo</h2>
              <p className="text-gray-600">Experience our multi-step room creation process</p>
            </div>
            <RoomCreator
              hostId="demo-host-id"
              hostEmail="demo@example.com"
              onRoomCreated={handleRoomCreated}
              onCancel={() => setCurrentView('overview')}
            />
          </div>
        )}
        
        {currentView === 'join' && (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Player Join Flow Demo</h2>
              <p className="text-gray-600">Try our streamlined player onboarding experience</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Tip: Use room code <strong>DEMO01</strong> to see the full flow
                </p>
              </div>
            </div>
            <PlayerJoinFlow
              roomCode="DEMO01"
              onJoinSuccess={handlePlayerJoined}
              onCancel={() => setCurrentView('overview')}
            />
          </div>
        )}
        
        {currentView === 'dashboard' && demoRoom && (
          <div>
            <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Room Dashboard Demo</h2>
              <p className="text-gray-600">
                Experience real-time room management with live updates
              </p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  🚀 This is a live demo with mock data simulating real-time features
                </p>
              </div>
            </div>
            <RoomDashboard
              roomCode={demoRoom.room_code}
              isHost={true}
              playerId={demoPlayer?.id}
              onRoomStatusChange={(status) => {
                console.log('Room status changed to:', status)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
} 