'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createShareableResult, getHostShareableResults, ShareableGameResult } from '@/services/shareService'

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
  const [shareableResults, setShareableResults] = useState<ShareableGameResult[]>([])
  const [sharingGame, setSharingGame] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const [shareSuccess, setShareSuccess] = useState<string | null>(null)

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
    
    // Load shareable results if user is authenticated
    const loadShareableResults = async () => {
      if (user) {
        const { results } = await getHostShareableResults(user.id)
        if (results) {
          setShareableResults(results)
        }
      }
    }
    
    loadShareableResults()
  }, [user])

  const handleCreateShareableLink = async (game: GameResult) => {
    if (!user) return
    
    setSharingGame(game.id)
    setShareError(null)
    setShareSuccess(null)
    
    try {
      const { shareUrl, error } = await createShareableResult(
        game.room_code,
        user.id,
        {
          players: game.players,
          duration: game.duration,
          host_name: user.user_metadata?.name || user.email || 'Unknown Host'
        }
      )
      
      if (error) {
        setShareError(error)
      } else if (shareUrl) {
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
        setShareSuccess(`Shareable link created and copied to clipboard!`)
        
        // Reload shareable results
        const { results } = await getHostShareableResults(user.id)
        if (results) {
          setShareableResults(results)
        }
      }
    } catch (error) {
      setShareError('Failed to create shareable link')
    } finally {
      setSharingGame(null)
    }
  }

  const copyShareableLink = async (shareToken: string) => {
    const shareUrl = `${window.location.origin}/share/${shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setShareSuccess('Link copied to clipboard!')
    setTimeout(() => setShareSuccess(null), 3000)
  }

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
        {/* Success/Error Messages */}
        {shareSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              <span className="text-green-800">{shareSuccess}</span>
            </div>
          </div>
        )}
        
        {shareError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">❌</span>
              <span className="text-red-800">{shareError}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">{/* Shared Links Section */}
          {shareableResults.length > 0 && (
            <div className="lg:col-span-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📤 Shared Game Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shareableResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{result.title}</h3>
                      <span className="text-xs text-gray-500">{result.room_code}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {new Date(result.date).toLocaleDateString()} • {result.players.length} players
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyShareableLink(result.share_token)}
                        className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                      >
                        📋 Copy Link
                      </button>
                      <Link
                        href={`/share/${result.share_token}`}
                        target="_blank"
                        className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium hover:bg-gray-100 transition-colors"
                      >
                        👁️ View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Past Games List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Games</h2>
            <div className="space-y-4">
              {pastGames.map((game) => (
                <div key={game.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setSelectedGame(game)}
                    className={`w-full text-left p-4 transition-all ${
                      selectedGame?.id === game.id
                        ? 'bg-purple-50'
                        : 'hover:bg-gray-50'
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
                  
                  {/* Share Button */}
                  <div className="px-4 pb-3 border-t border-gray-100">
                    <button
                      onClick={() => handleCreateShareableLink(game)}
                      disabled={sharingGame === game.id}
                      className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sharingGame === game.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          🔗 Create Shareable Link
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Results Display */}
          <div className="lg:col-span-2">
            {selectedGame ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
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
                    <button
                      onClick={() => handleCreateShareableLink(selectedGame)}
                      disabled={sharingGame === selectedGame.id}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sharingGame === selectedGame.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          🔗 Share Results
                        </span>
                      )}
                    </button>
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
                                  src="/avatars/gofind_1.png"
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
