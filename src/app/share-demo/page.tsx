'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ShareTestPage() {
  const [demoToken] = useState('demo123abc456def789')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔗 Shareable Results Feature Demo
          </h1>
          <p className="text-xl text-gray-300">
            Test the new shareable game results functionality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">✨ What&apos;s New</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-400">✅</span>
                <div>
                  <h3 className="text-white font-semibold">Public Sharing</h3>
                  <p className="text-gray-300 text-sm">Create links that anyone can view without signing in</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400">✅</span>
                <div>
                  <h3 className="text-white font-semibold">Beautiful Podium</h3>
                  <p className="text-gray-300 text-sm">Top 3 players displayed with medals and rankings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400">✅</span>
                <div>
                  <h3 className="text-white font-semibold">Complete Results</h3>
                  <p className="text-gray-300 text-sm">Full leaderboard with all players and scores</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-400">✅</span>
                <div>
                  <h3 className="text-white font-semibold">Easy Sharing</h3>
                  <p className="text-gray-300 text-sm">One-click link generation and copying</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Links */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">🎯 Try It Out</h2>
            <div className="space-y-4">
              <Link
                href={`/share/${demoToken}`}
                className="block w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all text-center font-medium"
              >
                🏆 View Demo Shared Results
              </Link>
              
              <Link
                href="/results"
                className="block w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all text-center font-medium"
              >
                📊 Go to Results Page
              </Link>
              
              <Link
                href="/dashboard"
                className="block w-full p-4 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all text-center font-medium border border-white/30"
              >
                🏠 Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">🔄 How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Link</h3>
              <p className="text-gray-300 text-sm">Host clicks &quot;Create Shareable Link&quot; on any completed game</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Share Link</h3>
              <p className="text-gray-300 text-sm">Link is copied automatically and can be shared with anyone</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">View Results</h3>
              <p className="text-gray-300 text-sm">Anyone can view beautiful results without signing in</p>
            </div>
          </div>
        </div>

        {/* Sample URL */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-3">📋 Sample Shareable URL</h3>
          <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-cyan-300">
            https://gofind.ai/share/{demoToken}
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Each shared result gets a unique token that&apos;s impossible to guess
          </p>
        </div>
      </div>
    </div>
  )
}
