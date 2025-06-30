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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <GoFindLogo size="sm" textColor="text-white" />
              <h1 className="text-xl font-semibold text-white">Hunt Host Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Your Hunt Rooms</h2>
            <Link
              href="/host/create"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Room</span>
            </Link>
          </div>
          
          {roomsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-300">Loading rooms...</span>
            </div>
          ) : roomsError ? (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {roomsError}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mt-4">No rooms created yet</h3>
              <p className="text-gray-500 mt-2">Get started by creating your first scavenger hunt room.</p>
              <Link
                href="/host/create"
                className="mt-6 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
              >
                Create Your First Room
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {rooms.map(room => (
                <div key={room.room_code} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:border-purple-500 transition-all">
                  <Link href={`/host/room/${room.room_code}`} className="block p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-lg font-bold tracking-widest text-purple-400">
                        {room.room_code}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        room.status === 'active' 
                          ? 'bg-green-900/50 text-green-300 border border-green-500' 
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="text-white font-semibold mb-2">
                      {room.metadata?.title || 'Untitled Hunt'}
                    </div>
                    <div className="text-gray-400 text-sm mb-3">
                      {room.metadata?.description || 'No description'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(room.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Active Hunt Rooms
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {rooms.filter(room => room.status === 'active').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Rooms
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {rooms.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Completed Hunts
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {rooms.filter(room => room.status === 'completed').length}
                    </dd>
                  </dl>
                </div>
              </div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🔍</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mission Control</h1>
                <p className="text-sm text-gray-300">Hunt Host Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">👤</span>
                </div>
                <span className="text-sm font-medium">
                  {user.user_metadata?.name || user.email}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                  Profile
                </Link>
                <Link href="/shop" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  Shop
                </Link>
                <Link href="/results" className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
                  Results
                </Link>
                <Link href="/share-demo" className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                  Share Demo
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-medium">Active Hunts</p>
                <p className="text-3xl font-bold text-white">{rooms.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Rooms</p>
                <p className="text-3xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-white">{rooms.filter(r => r.status === 'completed').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/host/create"
              className="group bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Create New Hunt</h3>
                  <p className="text-gray-300">Start a new scavenger hunt adventure</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/results"
              className="group bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">View Results</h3>
                  <p className="text-gray-300">Check past hunt performance and analytics</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Hunt Rooms */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Hunt Rooms</h2>
            <Link
              href="/host/create"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
            >
              + New Room
            </Link>
          </div>
          
          {roomsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          ) : roomsError ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-red-300">
              {roomsError}
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 text-center border border-white/10">
              <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No rooms yet</h3>
              <p className="text-gray-400 mb-6">Create your first hunt room to get started</p>
              <Link
                href="/host/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
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
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-cyan-500/20 rounded-full">
                      <span className="text-cyan-300 font-mono text-sm font-bold tracking-widest">
                        {room.room_code}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      room.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-300' :
                      room.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {room.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {room.metadata?.title || 'Untitled Hunt'}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {room.metadata?.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {new Date(room.created_at).toLocaleDateString()}</span>
                    <span>Max: {room.metadata?.max_players || 50} players</span>
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







