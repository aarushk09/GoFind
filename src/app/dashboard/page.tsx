'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getHostRooms } from '@/services/roomService'
import { Room } from '@/types/room'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Hunt Host Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
              <Link href="/profile" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Profile
              </Link>
              <Link href="/shop" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Shop
              </Link>
              <Link href="/results" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Results
              </Link>
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
          <h2 className="text-2xl font-bold mb-4">Your Hunt Rooms</h2>
          {roomsLoading ? (
            <div>Loading rooms...</div>
          ) : roomsError ? (
            <div className="text-red-500">{roomsError}</div>
          ) : rooms.length === 0 ? (
            <div className="text-gray-500">No rooms created yet.</div>
          ) : (
            <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <li key={room.room_code} className="bg-white rounded-lg shadow p-4 border border-purple-100 hover:shadow-lg transition">
                  <Link href={`/host/room/${room.room_code}`} className="block">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold tracking-widest text-purple-700">{room.room_code}</span>
                      <span className="text-xs text-gray-500">{room.status}</span>
                    </div>
                    <div className="mt-2 text-gray-900 font-semibold">{room.metadata?.title || 'Untitled Hunt'}</div>
                    <div className="text-gray-500 text-sm">{room.metadata?.description}</div>
                    <div className="text-xs text-gray-400 mt-1">Created: {new Date(room.created_at).toLocaleString()}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-purple-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-purple-600"
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Hunt Rooms
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-blue-600"
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Players Today
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-green-600"
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
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Hunts
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-white shadow-lg rounded-xl border border-gray-100">
              <div className="px-6 py-8 sm:p-8">
                <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2">
                  Ready to Create Amazing Scavenger Hunts? 🎯
                </h3>
                <div className="mt-2 max-w-2xl text-base text-gray-600">
                  <p>Welcome to your hunt host dashboard! Start creating engaging AI-powered scavenger hunts that will challenge and delight your players.</p>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Link
                    href="/host/create"
                    className="relative group block w-full border-2 border-purple-200 border-dashed rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <span className="block text-lg font-semibold text-gray-900 mb-2">
                      Create New Hunt Room
                    </span>
                    <span className="block text-sm text-gray-500">
                      Generate a room code and start hosting a scavenger hunt session
                    </span>
                  </Link>
                  <button className="relative group block w-full border-2 border-blue-200 border-dashed rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg
                        className="h-8 w-8 text-white"
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
                    <span className="block text-lg font-semibold text-gray-900 mb-2">
                      Create Hunt Room
                    </span>
                    <span className="block text-sm text-gray-500">
                      Set up a live room for players to join and compete in real-time
                    </span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-500">Hunts Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-500">Active Rooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-500">Total Players</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">0</div>
                      <div className="text-sm text-gray-500">Avg. Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}







