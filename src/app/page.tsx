'use client'

import Link from 'next/link'
import { GoFindLogo } from '@/components/ui/GoFindLogo'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      console.log('🏠 User detected on home page, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900">
              <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <GoFindLogo size="sm" textColor="text-white" />
        <div className="fixed top-0 right-0 p-4 lg:static lg:p-0">
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}></div>
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🔍</span>
            </div>
            <span className="text-2xl font-bold text-white">GoFind</span>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/auth/login"
              className="px-6 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
            >
              Host Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg border border-purple-400 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              Start Hosting
            </Link>
          </div>
        </nav>

      <div className="relative flex flex-col items-center text-center max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <GoFindLogo size="xl" textColor="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            AI Scavenger Hunt
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Create interactive scavenger hunts powered by AI. Like Kahoot, but for real-world exploration and discovery!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Create Your First Hunt
          </Link>
          <Link
            href="/join"
            className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border-2 border-gray-700 hover:border-purple-500 hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Join a Hunt
          </Link>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-6xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-6">
        <div className="group rounded-xl border border-gray-700 bg-gray-800 px-6 py-8 transition-all hover:border-purple-500 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
            <svg className="w-6 h-6 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">
            Create Rooms
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Set up interactive scavenger hunt rooms with custom challenges and AI-powered clues.
          </p>
        </div>

        <div className="group rounded-xl border border-gray-700 bg-gray-800 px-6 py-8 transition-all hover:border-purple-500 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
            <svg className="w-6 h-6 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">
            AI-Powered Hints
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Get intelligent clues and hints that adapt to player progress and location.
          </p>
        </div>

        <div className="group rounded-xl border border-gray-700 bg-gray-800 px-6 py-8 transition-all hover:border-purple-500 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
            <svg className="w-6 h-6 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">
            Real-time Play
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Watch teams compete in real-time with live leaderboards and instant feedback.
          </p>
        </div>

        <div className="group rounded-xl border border-gray-700 bg-gray-800 px-6 py-8 transition-all hover:border-purple-500 hover:shadow-lg hover:-translate-y-1">
          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
            <svg className="w-6 h-6 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="mb-3 text-xl font-semibold text-white">
            Analytics & Insights
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Track performance, engagement, and learning outcomes with detailed analytics.
          </p>
        
        {/* Hero Content */}
        <div className="relative z-10 pt-20 pb-32 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Icons */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">🤖</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Scavenger Hunts</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create immersive AI-powered scavenger hunts that blend digital intelligence with real-world exploration. 
              Like Kahoot, but for adventures that matter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/auth/signup"
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Create Your Hunt</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/join"
                className="group px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Join a Hunt</span>
                  <span className="text-2xl">🔍</span>
                </span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400">Hunts Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-gray-400">Players Engaged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-400">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by Intelligence, Driven by Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform transforms ordinary locations into extraordinary learning experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Room Creation</h3>
              <p className="text-gray-600 leading-relaxed">Generate unique hunt rooms with AI-crafted challenges that adapt to any location or theme.</p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Hints</h3>
              <p className="text-gray-600 leading-relaxed">Intelligent clues that provide just the right amount of guidance to keep players engaged and learning.</p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Competition</h3>
              <p className="text-gray-600 leading-relaxed">Live leaderboards, instant feedback, and dynamic scoring that keeps the excitement alive.</p>
            </div>

            <div className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Analytics</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive insights into player behavior, learning outcomes, and engagement patterns.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Learning?</h2>
          <p className="text-xl text-purple-100 mb-8">Join thousands of educators and event organizers creating unforgettable experiences.</p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Get Started Free
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}










