'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface GameResult {
  id: string
  room_code: string
  title: string
  date: string
  players: {
    id: string
    name: string
    score: number
    avatar?: string
  }[]
  duration: string
  status: 'completed' | 'cancelled'
}

export default function ResultsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pastGames, setPastGames] = useState<GameResult[]>([])
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null)

  // Sample data - replace with actual API call
  useEffect(() => {
    const sampleGames: GameResult[] = [
      {
        id: '1',
        room_code: 'ABC123',
        title: 'AI Treasure Hunt',
        date: '2025-06-26',
        duration: '23m 45s',
        status: 'completed',
        players: [
          { id: '1', name: 'Alex Johnson', score: 850, avatar: 'gofind_1' },
          { id: '2', name: 'Maria Garcia', score: 720, avatar: 'gofind_2' },
          { id: '3', name: 'Sam Chen', score: 680 },
          { id: '4', name: 'Lisa Park', score: 590 },
          { id: '5', name: 'Mike Brown', score: 430 },
        ]
      },
      {
        id: '2',
        room_code: 'XYZ789',
        title: 'Office Quest',
        date: '2025-06-25',
        duration: '18m 12s',
        status: 'completed',
        players: [
          { id: '6', name: 'Emma Davis', score: 920 },
          { id: '7', name: 'John Smith', score: 780, avatar: 'gofind_1' },
          { id: '8', name: 'Sarah Wilson', score: 650 },
        ]
      },
      {
        id: '3',
        room_code: 'DEF456',
        title: 'Campus Adventure',
        date: '2025-06-24',
        duration: '31m 08s',
        status: 'completed',
        players: [
          { id: '9', name: 'David Lee', score: 1050 },
          { id: '10', name: 'Anna Taylor', score: 980, avatar: 'gofind_2' },
          { id: '11', name: 'Chris Moore', score: 920 },
          { id: '12', name: 'Jenny White', score: 810 },
          { id: '13', name: 'Tom Anderson', score: 750 },
          { id: '14', name: 'Kate Johnson', score: 690 },
        ]
      }
    ]
    setPastGames(sampleGames)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const getPodiumPosition = (index: number) => {
    if (index === 0) return 'gold'
    if (index === 1) return 'silver'
    if (index === 2) return 'bronze'
    return null
  }

  const getPodiumHeight = (index: number) => {
    if (index === 0) return 'h-32'
    if (index === 1) return 'h-24'
    if (index === 2) return 'h-20'
    return 'h-16'
  }

  const getPodiumColor = (position: string | null) => {
    switch (position) {
      case 'gold': return 'bg-gradient-to-t from-yellow-400 to-yellow-300'
      case 'silver': return 'bg-gradient-to-t from-gray-400 to-gray-300'
      case 'bronze': return 'bg-gradient-to-t from-orange-400 to-orange-300'
      default: return 'bg-gradient-to-t from-blue-400 to-blue-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Game Results</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Past Games List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Games</h2>
            <div className="space-y-4">
              {pastGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedGame?.id === game.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{game.title}</h3>
                    <span className="text-xs text-gray-500">{game.room_code}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(game.date).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{game.players.length} players</span>
                    <span className="text-gray-500">{game.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Results Display */}
          <div className="lg:col-span-2">
            {selectedGame ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedGame.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>Room: {selectedGame.room_code}</span>
                    <span>•</span>
                    <span>{new Date(selectedGame.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Duration: {selectedGame.duration}</span>
                    <span>•</span>
                    <span>{selectedGame.players.length} players</span>
                  </div>
                </div>

                {/* Podium */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-center mb-8">🏆 Winners Podium</h3>
                  <div className="flex items-end justify-center space-x-8">
                    {selectedGame.players.slice(0, 3).map((player, index) => {
                      const position = getPodiumPosition(index)
                      const height = getPodiumHeight(index)
                      const color = getPodiumColor(position)
                      
                      return (
                        <div key={player.id} className="text-center">
                          {/* Avatar */}
                          <div className="mb-4">
                            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                              {player.avatar === 'gofind_1' ? (
                                <Image
                                  src="/gofind_1.png"
                                  alt={player.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : player.avatar === 'gofind_2' ? (
                                <Image
                                  src="/avatars/gofind_2.png"
                                  alt={player.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                                  {player.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Player Info */}
                          <div className="mb-2">
                            <p className="font-semibold text-gray-900">{player.name}</p>
                            <p className="text-2xl font-bold text-purple-600">{player.score}</p>
                          </div>
                          
                          {/* Podium Step */}
                          <div className={`w-24 ${height} ${color} rounded-t-lg flex items-end justify-center pb-2 shadow-lg relative`}>
                            {position && (
                              <div className="absolute -top-6">
                                {position === 'gold' && <span className="text-3xl">🥇</span>}
                                {position === 'silver' && <span className="text-3xl">🥈</span>}
                                {position === 'bronze' && <span className="text-3xl">🥉</span>}
                              </div>
                            )}
                            <span className="text-white font-bold text-lg">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Full Leaderboard */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Leaderboard</h3>
                  <div className="space-y-3">
                    {selectedGame.players.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-400 text-gray-900' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-blue-400 text-blue-900'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            {player.avatar === 'gofind_1' ? (
                              <Image
                                src="/gofind_1.png"
                                alt={player.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : player.avatar === 'gofind_2' ? (
                              <Image
                                src="../../../public/avatars/gofind_2.png"
                                alt={player.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                                {player.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900">{player.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-purple-600">{player.score}</span>
                          <span className="text-sm text-gray-500 ml-1">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Game</h3>
                <p className="text-gray-600">Choose a game from the list to view detailed results and podium standings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
