import React, { useState } from 'react'
import { Room, Player, HuntChallenge } from '@/types/room'
import { generateRoomChallenges } from '@/services/challengeService'
import GameInterface from '@/components/game/GameInterface'
import ChallengeCard from '@/components/game/ChallengeCard'
import { ToastProvider } from '@/components/ui/Toast'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Mock data for demo
const mockRoom: Room = {
  id: '1',
  room_code: 'GAME01',
  host_id: 'mock-host-id',
  host_email: 'host@example.com',
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metadata: {
    title: 'Urban Explorer Challenge',
    description: 'A thrilling city-wide scavenger hunt',
    max_players: 25,
    time_limit: 60,
    difficulty: 'medium',
    theme: 'urban',
    is_public: true,
    tags: ['urban', 'photography', 'exploration']
  }
}

const mockPlayer: Player = {
  id: 'mock-player-id',
  room_code: 'GAME01',
  player_name: 'Alex Explorer',
  player_email: 'alex@example.com',
  score: 45,
  status: 'active',
  joined_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  metadata: {
    device_type: 'mobile',
    preferences: {
      notifications: true,
      sound_effects: true,
      dark_mode: false
    }
  } as any
}

const mockChallenges: HuntChallenge[] = [
  {
    id: '1',
    room_code: 'GAME01',
    challenge_order: 1,
    challenge_type: 'photo',
    challenge_data: {
      title: 'Street Art Discovery',
      description: 'Find and photograph a piece of street art or mural',
      hint: 'Look for colorful walls in artistic neighborhoods',
      validation_keywords: ['mural', 'graffiti', 'street art', 'wall art'],
      required_elements: ['artwork', 'outdoor wall']
    },
    points: 15,
    time_limit_seconds: 900,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    room_code: 'GAME01',
    challenge_order: 2,
    challenge_type: 'location',
    challenge_data: {
      title: 'Historic Landmark',
      description: 'Navigate to the oldest building in your area',
      hint: 'Check historical markers and plaques',
      target_location: {
        lat: 40.7589,
        lng: -73.9851,
        radius: 100,
        name: 'Central Park'
      }
    },
    points: 20,
    time_limit_seconds: 1200,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    room_code: 'GAME01',
    challenge_order: 3,
    challenge_type: 'ai_prompt',
    challenge_data: {
      title: 'Urban Riddle',
      description: 'Solve this riddle about your city',
      hint: 'Think about places where people gather daily',
      acceptable_answers: ['subway', 'train station', 'bus stop', 'transit hub']
    },
    ai_prompt: 'What place connects all parts of the city underground, where thousands pass daily but few stay long?',
    points: 25,
    time_limit_seconds: 600,
    created_at: new Date().toISOString()
  }
]

export default function GameDemo() {
  const [currentView, setCurrentView] = useState<'overview' | 'challenge-creator' | 'single-challenge' | 'full-game'>('overview')
  const [selectedChallenge, setSelectedChallenge] = useState<HuntChallenge | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedChallenges, setGeneratedChallenges] = useState<HuntChallenge[]>([])

  const handleGenerateChallenges = async (theme: string, difficulty: string) => {
    setIsGenerating(true)
    try {
      const result = await generateRoomChallenges('DEMO', theme, difficulty, 5)
      if (result.challenges) {
        setGeneratedChallenges(result.challenges)
      }
    } catch (error) {
      console.error('Error generating challenges:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderOverview = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Game System Demo
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Experience our interactive challenge system with AI validation
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Challenge System</h3>
          <p className="text-gray-300 text-sm mb-4">
            AI-powered challenges with photo validation, location tracking, and smart scoring
          </p>
          <button
            onClick={() => setCurrentView('challenge-creator')}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Challenge Creator
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Cards</h3>
          <p className="text-gray-600 text-sm mb-4">
            Rich challenge cards with real-time submission and validation feedback
          </p>
          <button
            onClick={() => {
              setSelectedChallenge(mockChallenges[0])
              setCurrentView('single-challenge')
            }}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Try Challenge Card
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Game Experience</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete game interface with progress tracking and live leaderboards
          </p>
          <button
            onClick={() => setCurrentView('full-game')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Play Full Game
          </button>
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Advanced Game Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'AI Validation', desc: 'Smart answer checking', component: <svg className="w-8 h-8 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633z" clipRule="evenodd" /></svg> },
            { name: 'Photo Recognition', desc: 'Computer vision validation', component: <svg className="w-8 h-8 text-orange-600 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg> },
            { name: 'GPS Integration', desc: 'Location-based challenges', component: <svg className="w-8 h-8 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> },
            { name: 'Real-time Updates', desc: 'Live progress tracking', component: <svg className="w-8 h-8 text-blue-600 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg> }
          ].map((feature) => (
            <div key={feature.name} className="text-center">
              <div className="mb-2">{feature.component}</div>
              <h3 className="font-semibold text-white">{feature.name}</h3>
              <p className="text-sm text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Types */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenge Types</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { type: 'Photo', component: <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>, desc: 'Take photos of specific objects or locations' },
            { type: 'Location', component: <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>, desc: 'Navigate to GPS coordinates' },
            { type: 'Text', component: <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>, desc: 'Answer questions or solve riddles' },
            { type: 'QR Code', component: <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" clipRule="evenodd" /></svg>, desc: 'Scan hidden QR codes' },
            { type: 'AI Prompt', component: <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633z" clipRule="evenodd" /></svg>, desc: 'Solve AI-generated challenges' },
            { type: 'Mixed', component: <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" clipRule="evenodd" /></svg>, desc: 'Combination of multiple types' }
          ].map((challenge) => (
            <div key={challenge.type} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">{challenge.component}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{challenge.type}</h3>
                <p className="text-sm text-gray-600">{challenge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 text-center">
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600">5+</div>
          <div className="text-sm text-gray-600">Challenge Types</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600">AI</div>
          <div className="text-sm text-gray-600">Smart Validation</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600">GPS</div>
          <div className="text-sm text-gray-600">Location Tracking</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-3xl font-bold text-orange-600">Real-time</div>
          <div className="text-sm text-gray-600">Live Updates</div>
        </div>
      </div>
    </div>
  )

  const renderChallengeCreator = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Creator Demo</h2>
        <p className="text-gray-600">Generate custom challenges based on theme and difficulty</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Challenges</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {['urban', 'nature', 'indoor', 'mixed'].map(theme => (
                <button
                  key={theme}
                  onClick={() => handleGenerateChallenges(theme, 'medium')}
                  disabled={isGenerating}
                  className="p-3 text-center border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors capitalize"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="grid grid-cols-2 gap-2">
              {['easy', 'medium', 'hard', 'expert'].map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => handleGenerateChallenges('mixed', difficulty)}
                  disabled={isGenerating}
                  className="p-3 text-center border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors capitalize"
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-6 text-center">
            <LoadingSpinner size="lg" text="Generating challenges..." />
          </div>
        )}
      </div>

      {generatedChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Challenges</h3>
          {generatedChallenges.map((challenge, index) => (
            <div key={challenge.id || index} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{challenge.challenge_data.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.challenge_data.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-blue-600">Type: {challenge.challenge_type}</span>
                    <span className="text-green-600">Points: {challenge.points}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedChallenge(challenge)
                    setCurrentView('single-challenge')
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderSingleChallenge = () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Challenge Demo</h2>
        <p className="text-gray-600">Experience a single challenge with real-time validation</p>
      </div>

      {selectedChallenge && (
        <ChallengeCard
          challenge={selectedChallenge}
          playerId={mockPlayer.id}
          isActive={true}
          onSubmissionComplete={(progress) => {
            console.log('Challenge completed:', progress)
          }}
        />
      )}
    </div>
  )

  const renderFullGame = () => (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Full Game Experience</h2>
        <p className="text-gray-600">Complete game interface with all features</p>
      </div>
      
      <GameInterface
        player={mockPlayer}
        room={mockRoom}
        onGameComplete={() => {
          console.log('Game completed!')
        }}
      />
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
              {currentView === 'challenge-creator' && 'Challenge Creator'}
              {currentView === 'single-challenge' && 'Interactive Challenge'}
              {currentView === 'full-game' && 'Full Game Experience'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Live Demo</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ToastProvider position="top-right">
      <div className="min-h-screen bg-gray-900">
        {currentView !== 'overview' && renderNavigationHeader()}
        
        <div className="py-8 px-4">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'challenge-creator' && renderChallengeCreator()}
          {currentView === 'single-challenge' && renderSingleChallenge()}
          {currentView === 'full-game' && renderFullGame()}
        </div>
      </div>
    </ToastProvider>
  )
} 