'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getHostRooms } from '@/services/roomService'
import { Room } from '@/types/room'

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState('gofind_1')
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: ''
  })
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    completedRooms: 0,
    totalPlayers: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    } else if (user) {
      setProfileData({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        bio: (user.user_metadata as any)?.bio || ''
      })
      setSelectedAvatar((user.user_metadata as any)?.avatar || 'gofind_1')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return
      setRoomsLoading(true)
      
      const result = await getHostRooms(user.id)
      if (result.rooms) {
        setRooms(result.rooms)
        
        // Calculate stats
        const totalRooms = result.rooms.length
        const activeRooms = result.rooms.filter(room => room.status === 'active' || room.status === 'waiting').length
        const completedRooms = result.rooms.filter(room => room.status === 'completed').length
        
        setStats({
          totalRooms,
          activeRooms,
          completedRooms,
          totalPlayers: 0 // TODO: Calculate from players table when needed
        })
      }
      setRoomsLoading(false)
    }
    
    if (user) fetchUserData()
  }, [user])

  const handleSaveProfile = async () => {
    // TODO: Implement profile update functionality
    setIsEditing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
                Dashboard
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <div className="bg-white shadow-lg rounded-xl border border-purple-100 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {selectedAvatar === 'gofind_1' ? (
                    <Image
                      src="/avatars/gofind_1.png"
                      alt="GoFind Avatar"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="text-gray-500 text-xs text-center">
                      {selectedAvatar}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.name || 'Host User'}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Avatar Selection */}
            {isEditing && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Avatar</h3>
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {['gofind_1', 'gofind_2', 'gofind_3', 'gofind_4', 'gofind_5'].map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-16 h-16 rounded-lg border-2 transition-colors ${
                        selectedAvatar === avatar
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {avatar === 'gofind_1' ? (
                        <Image
                          src="/avatars/gofind_1.png"
                          alt="GoFind Avatar 1"
                          width={64}
                          height={64}
                          className="rounded-lg"
                        />
                      ) : avatar === 'gofind_2' ? (
                        <Image
                          src="/avatars/gofind_2.png"
                          alt="GoFind Avatar 2"
                          width={64}
                          height={64}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="text-xs text-gray-600 text-center p-1">
                          {avatar}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors text-sm"
                >
                  Get More Avatars
                </Link>
              </div>
            )}

            {/* Profile Edit Form */}
            {isEditing && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-purple-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.totalRooms}</dd>
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
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Rooms</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.activeRooms}</dd>
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
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Rooms</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.completedRooms}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-yellow-100">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Players</dt>
                      <dd className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rooms */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Rooms</h3>
            </div>
            <div className="p-6">
              {roomsLoading ? (
                <div className="text-center py-4">Loading rooms...</div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No rooms created yet.</p>
                  <Link href="/host/create" className="text-purple-600 hover:text-purple-700 font-medium">
                    Create your first room
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.slice(0, 5).map(room => (
                    <div key={room.room_code} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="font-mono text-lg font-bold tracking-widest text-purple-700">
                          {room.room_code}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {room.metadata?.title || 'Untitled Hunt'}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(room.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          room.status === 'active' ? 'bg-green-100 text-green-800' :
                          room.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          room.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {room.status}
                        </span>
                        <Link 
                          href={`/host/room/${room.room_code}`}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                  {rooms.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
                        View all rooms →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-6 bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/host/create"
                className="block w-full text-left px-4 py-2 border border-purple-200 rounded-md hover:bg-purple-50 text-purple-700 font-medium transition-colors"
              >
                Create New Room
              </Link>
              <Link 
                href="/dashboard"
                className="block w-full text-left px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 text-blue-700 font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 border border-red-200 rounded-md hover:bg-red-50 text-red-700 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
