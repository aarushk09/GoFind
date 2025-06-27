'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

export default function ShopPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [ownedAvatars, setOwnedAvatars] = useState(['gofind_1']) // User starts with gofind_1

  const avatars = [
    {
      id: 'gofind_1',
      name: 'Dinosaur Friend',
      price: 0,
      owned: true,
      image: '/avatars/gofind_1.png'
    },
    {
      id: 'gofind_2',
      name: 'Cool Cat',
      price: 100,
      owned: false,
      placeholder: true
    },
    {
      id: 'gofind_3',
      name: 'Space Explorer',
      price: 150,
      owned: false,
      placeholder: true
    },
    {
      id: 'gofind_4',
      name: 'Magic Wizard',
      price: 200,
      owned: false,
      placeholder: true
    },
    {
      id: 'gofind_5',
      name: 'Robot Hero',
      price: 250,
      owned: false,
      placeholder: true
    }
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handlePurchase = (avatarId: string) => {
    // TODO: Implement actual purchase logic
    setOwnedAvatars(prev => [...prev, avatarId])
    alert(`Successfully purchased ${avatars.find(a => a.id === avatarId)?.name}!`)
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
      <nav className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Avatar Shop</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-purple-600 hover:text-purple-700 font-medium">
                Profile
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-700 font-medium">1,000 Coins</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Avatar Shop</h1>
          <p className="text-lg text-gray-600">
            Customize your profile with awesome avatars! Complete hunts to earn coins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {avatar.placeholder ? (
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎭</div>
                      <div className="text-sm text-gray-500">{avatar.id}</div>
                    </div>
                  ) : (
                    <Image
                      src={avatar.image!}
                      alt={avatar.name}
                      width={128}
                      height={128}
                      className="rounded-xl"
                    />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {avatar.name}
                  </h3>
                  
                  {avatar.owned || ownedAvatars.includes(avatar.id) ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Owned</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-bold text-gray-900">{avatar.price} Coins</span>
                      </div>
                      
                      <button
                        onClick={() => handlePurchase(avatar.id)}
                        disabled={avatar.price > 1000} // Assuming user has 1000 coins
                        className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                          avatar.price > 1000
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        }`}
                      >
                        {avatar.price > 1000 ? 'Not Enough Coins' : 'Purchase'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Earn Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Hunts</h3>
              <p className="text-gray-600">Earn 50 coins for each scavenger hunt you create</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Host Events</h3>
              <p className="text-gray-600">Get 10 coins for every player that joins your hunt</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Achievements</h3>
              <p className="text-gray-600">Unlock special rewards and bonus coins</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
