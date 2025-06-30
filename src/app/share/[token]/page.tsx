'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getShareableResult, ShareableGameResult, getDemoShareableResult } from '@/services/shareService'

export default function SharedResultPage() {
  const params = useParams()
  const token = params.token as string
  const [result, setResult] = useState<ShareableGameResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      if (!token) return
      
      setLoading(true)
      
      // Handle demo case
      if (token === 'demo123abc456def789') {
        const demoResult = getDemoShareableResult()
        setResult(demoResult)
        setLoading(false)
        return
      }
      
      const { result, error } = await getShareableResult(token)
      
      if (error) {
        setError(error)
      } else if (result) {
        setResult(result)
      }
      
      setLoading(false)
    }

    fetchResult()
  }, [token])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    // You might want to show a toast notification here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading game results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Results Not Found</h1>
          <p className="text-gray-300 mb-8">
            {error || 'The shared game results you&apos;re looking for don&apos;t exist or may have been removed.'}
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium"
          >
            Go to GoFind
          </Link>
        </div>
      </div>
    )
  }

  // Sort players by score (highest first)
  const sortedPlayers = [...result.players].sort((a, b) => b.score - a.score)
  const topThree = sortedPlayers.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🔍</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GoFind Results</h1>
                <p className="text-sm text-gray-300">Shared Game Results</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                📋 Copy Link
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
              >
                Try GoFind
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{result.title}</h2>
              <p className="text-gray-300 mb-4">{result.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>🎯 Room: {result.room_code}</span>
                <span>👤 Host: {result.host_name}</span>
                <span>📅 {new Date(result.date).toLocaleDateString()}</span>
                <span>⏱️ Duration: {result.duration}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{result.players.length}</div>
              <div className="text-gray-400">Players</div>
            </div>
          </div>
        </div>

        {result.players.length > 0 ? (
          <>
            {/* Podium */}
            {topThree.length >= 3 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">🏆 Top Performers</h3>
                <div className="flex items-end justify-center space-x-8">
                  {/* Second Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-gray-300">
                        {topThree[1]?.avatar ? (
                          <Image
                            src={`/avatars/${topThree[1].avatar}.png`}
                            alt={topThree[1].name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-gray-400/20 to-gray-500/20 rounded-xl p-4 border border-gray-400/30">
                      <div className="font-bold text-white text-lg">{topThree[1]?.name}</div>
                      <div className="text-gray-300 text-xl font-bold">{topThree[1]?.score} pts</div>
                    </div>
                  </div>

                  {/* First Place */}
                  <div className="text-center -mt-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-yellow-300 shadow-lg">
                        {topThree[0]?.avatar ? (
                          <Image
                            src={`/avatars/${topThree[0].avatar}.png`}
                            alt={topThree[0].name}
                            width={80}
                            height={80}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        1
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <span className="text-3xl">👑</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-xl p-6 border border-yellow-400/30">
                      <div className="font-bold text-white text-xl">{topThree[0]?.name}</div>
                      <div className="text-yellow-300 text-2xl font-bold">{topThree[0]?.score} pts</div>
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center mb-4 mx-auto border-4 border-amber-500">
                        {topThree[2]?.avatar ? (
                          <Image
                            src={`/avatars/${topThree[2].avatar}.png`}
                            alt={topThree[2].name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 rounded-xl p-4 border border-amber-600/30">
                      <div className="font-bold text-white text-lg">{topThree[2]?.name}</div>
                      <div className="text-amber-300 text-xl font-bold">{topThree[2]?.score} pts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Results Table */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Complete Results</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-gray-300 font-medium">Rank</th>
                      <th className="px-6 py-4 text-gray-300 font-medium">Player</th>
                      <th className="px-6 py-4 text-gray-300 font-medium">Score</th>
                      <th className="px-6 py-4 text-gray-300 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => (
                      <tr key={player.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`font-bold text-lg ${
                              index === 0 ? 'text-yellow-400' :
                              index === 1 ? 'text-gray-400' :
                              index === 2 ? 'text-amber-600' :
                              'text-white'
                            }`}>
                              #{index + 1}
                            </span>
                            {index < 3 && (
                              <span className="ml-2">
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              {player.avatar ? (
                                <Image
                                  src={`/avatars/${player.avatar}.png`}
                                  alt={player.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <span className="text-sm">👤</span>
                              )}
                            </div>
                            <span className="font-medium text-white">{player.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-white text-lg">{player.score}</span>
                          <span className="text-gray-400 ml-1">pts</span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {player.completion_time || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
            <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Results Available</h3>
            <p className="text-gray-400">This game doesn&apos;t have any recorded results yet.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400 mb-4">
            <span>Powered by</span>
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔍</span>
            </div>
            <span className="font-bold text-white">GoFind</span>
          </div>
          <p className="text-sm text-gray-500">Create your own AI-powered scavenger hunts</p>
        </div>
      </main>
    </div>
  )
}
