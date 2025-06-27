'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">Create a New Hunt</h1>
              <p className="mt-2 text-gray-600">
                Set up your AI scavenger hunt session and get a room code to share with players.
              </p>
            </div>

            {/* Database Status Indicator */}
            {dbStatus === 'checking' && (
              <div className="mb-6 rounded-md bg-blue-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">Checking database connection...</p>
                  </div>
                </div>
              </div>
            )}

            {dbStatus === 'error' && (
              <div className="mb-6 rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Database Setup Required</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Please set up your Supabase database tables before creating rooms. 
                      <a href="/SETUP.md" target="_blank" className="font-medium underline ml-1">
                        View setup guide
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Quick Start Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <div className="space-y-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Quick Start</h3>
                    <p className="text-sm text-gray-500">Start a hunt immediately with default settings</p>
                  </div>                  <button
                    onClick={handleQuickStart}
                    disabled={isLoading || dbStatus !== 'ready'}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Quick Start Hunt'}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or customize your hunt</span>
                </div>
              </div>

              {/* Custom Room Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Hunt Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="My Awesome Scavenger Hunt"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe what players will be searching for..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="max_players" className="block text-sm font-medium text-gray-700">
                      Max Players
                    </label>
                    <select
                      name="max_players"
                      id="max_players"
                      value={formData.max_players}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={10}>10 players</option>
                      <option value={25}>25 players</option>
                      <option value={50}>50 players</option>
                      <option value={100}>100 players</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700">
                      Time Limit (minutes)
                    </label>
                    <select
                      name="time_limit"
                      id="time_limit"
                      value={formData.time_limit}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || dbStatus !== 'ready'}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Hunt...' : 'Create Hunt Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


