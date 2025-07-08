'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createRoom } from '@/services/roomService'
import { testDatabaseConnection } from '@/services/databaseTest'
import { CreateRoomData } from '@/types/room'

export default function CreateRoomPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'error'>('checking')
  const [formData, setFormData] = useState<CreateRoomData>({
    title: '',
    description: '',
    max_players: 25,
    time_limit: 30
  })
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Test database connection on component mount
    const checkDatabase = async () => {
      const result = await testDatabaseConnection()
      if (result.success) {
        setDbStatus('ready')
      } else {
        setDbStatus('error')
        setError(result.error || 'Database connection failed')
      }
    }

    if (user) {
      checkDatabase()
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to create a room')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await createRoom(user.id, user.email, formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.room) {
        // Redirect to the room lobby with the room code
        router.push(`/host/room/${result.room.room_code}`)
      }
    } catch (error) {
      console.error('Error creating room:', error)
      setError('An unexpected error occurred while creating the room')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickStart = async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)

    try {
      const quickRoomData: CreateRoomData = {
        title: 'Quick Hunt',
        description: 'A quick AI scavenger hunt session',
        max_players: 25,
        time_limit: 15
      }
      
      const result = await createRoom(user.id, user.email, quickRoomData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.room) {
        router.push(`/host/room/${result.room.room_code}`)
      }
    } catch (error) {
      console.error('Error creating quick room:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-white">GoFind</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Hunt</h1>
          <p className="text-gray-400">
            Set up your scavenger hunt session and get a room code to share with players.
          </p>
        </div>

        {/* Database Status Indicator */}
        {dbStatus === 'checking' && (
          <div className="mb-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
              <p className="text-sm text-blue-300">Checking database connection...</p>
            </div>
          </div>
        )}

        {dbStatus === 'error' && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-300">Database Setup Required</h3>
                <p className="mt-1 text-sm text-yellow-400">
                  Please set up your Supabase database tables before creating rooms.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-300">Error</h3>
                <p className="mt-1 text-sm text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Quick Start Option */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Quick Start</h3>
                <p className="text-sm text-gray-400">Start a hunt immediately with default settings</p>
              </div>
              <button
                onClick={handleQuickStart}
                disabled={isLoading || dbStatus !== 'ready'}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isLoading ? 'Creating...' : 'Quick Start Hunt'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-950 text-gray-500">Or customize your hunt</span>
            </div>
          </div>

          {/* Custom Room Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Hunt Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter hunt title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your hunt..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="max_players" className="block text-sm font-medium text-gray-300 mb-2">
                    Max Players
                  </label>
                  <select
                    id="max_players"
                    name="max_players"
                    value={formData.max_players}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={10}>10 players</option>
                    <option value={25}>25 players</option>
                    <option value={50}>50 players</option>
                    <option value={100}>100 players</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="time_limit" className="block text-sm font-medium text-gray-300 mb-2">
                    Time Limit (minutes)
                  </label>
                  <select
                    id="time_limit"
                    name="time_limit"
                    value={formData.time_limit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading || dbStatus !== 'ready'}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  {isLoading ? 'Creating Hunt...' : 'Create Hunt'}
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 border border-gray-700 hover:border-gray-600 text-gray-300 rounded-md font-medium transition-colors inline-flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}