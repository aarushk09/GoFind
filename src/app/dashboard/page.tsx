'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getHostRooms } from '@/services/roomService'
import { Room } from '@/types/room'
import { GoFindLogo } from '@/components/ui/GoFindLogo'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user) return
      setRoomsLoading(true)
      setRoomsError(null)
      const result = await getHostRooms(user.id)
      if (result.error) {
        setRoomsError(result.error)
      } else if (result.rooms) {
        setRooms(result.rooms)
      }
      setRoomsLoading(false)
    }
    fetchRooms()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm">
                  {user.user_metadata?.name || user.email}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Hunts</p>
                <p className="text-2xl font-semibold text-white">{rooms.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Rooms</p>
                <p className="text-2xl font-semibold text-white">{rooms.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-white">{rooms.filter(r => r.status === 'completed').length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/host/create"
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Create New Hunt</h3>
                  <p className="text-sm text-gray-400">Set up a new scavenger hunt room</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/results"
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">View Analytics</h3>
                  <p className="text-sm text-gray-400">Review hunt performance and insights</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Hunt Rooms */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Your Hunt Rooms</h2>
            <Link
              href="/host/create"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              New Room
            </Link>
          </div>
          
          {roomsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : roomsError ? (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-300">
              {roomsError}
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No rooms yet</h3>
              <p className="text-gray-400 mb-6">Create your first hunt room to get started</p>
              <Link
                href="/host/create"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors inline-flex items-center"
              >
                Create First Room
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <Link 
                  key={room.room_code} 
                  href={`/host/room/${room.room_code}`}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-800 px-3 py-1 rounded-md">
                      <span className="text-green-400 font-mono text-sm font-medium tracking-wider">
                        {room.room_code}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'active' ? 'bg-green-900/50 text-green-400' :
                      room.status === 'waiting' ? 'bg-yellow-900/50 text-yellow-400' :
                      room.status === 'completed' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-white mb-2 group-hover:text-green-400 transition-colors">
                    {room.metadata?.title || 'Untitled Hunt'}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {room.metadata?.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created {new Date(room.created_at).toLocaleDateString()}</span>
                    <span>Max {room.metadata?.max_players || 50} players</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}







