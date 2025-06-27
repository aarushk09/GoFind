import React, { useState, useEffect } from 'react';
import { AvatarId } from '../components/avatars/AvatarTypes';
import { AvatarGallery } from '../components/avatars/AvatarGallery';
import { AvatarCustomizer } from '../components/avatars/AvatarCustomizer';
import { AvatarDisplay } from '../components/avatars/AvatarDisplay';
import { useAvatar } from '../hooks/useAvatar';

interface AvatarStats {
  totalSelections: number;
  favoriteAvatar: AvatarId;
  sessionTime: number;
  customizations: number;
}

export default function AvatarDemo() {
  const {
    selectedAvatar,
    setSelectedAvatar,
    clearAvatar,
    isAvatarSelected,
    getRandomAvatar,
    avatarData
  } = useAvatar();

  const [activeTab, setActiveTab] = useState<'gallery' | 'customizer' | 'analytics'>('gallery');
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<AvatarStats>({
    totalSelections: 0,
    favoriteAvatar: 'explorer',
    sessionTime: 0,
    customizations: 0
  });
  const [sessionStart] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStart) / 1000)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  const handleAvatarSelect = (avatarId: AvatarId) => {
    setSelectedAvatar(avatarId);
    setStats(prev => ({
      ...prev,
      totalSelections: prev.totalSelections + 1,
      favoriteAvatar: avatarId
    }));
  };

  const handleAvatarSave = (avatarId: AvatarId, displayName: string) => {
    setSelectedAvatar(avatarId);
    setUserName(displayName);
    setStats(prev => ({
      ...prev,
      customizations: prev.customizations + 1
    }));
    setActiveTab('analytics');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-white">Avatar Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAvatarSelected && (
                <div className="flex items-center space-x-3 bg-gray-700 rounded-lg px-3 py-2">
                  <AvatarDisplay
                    avatarId={selectedAvatar!}
                    size={32}
                    variant="simple"
                  />
                  <span className="text-sm text-gray-300">{userName || 'Guest'}</span>
                </div>
              )}
              <div className="text-sm text-gray-400">
                Session: {formatTime(stats.sessionTime)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Selections</p>
                <p className="text-2xl font-semibold text-white">{stats.totalSelections}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Customizations</p>
                <p className="text-2xl font-semibold text-white">{stats.customizations}</p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Session Time</p>
                <p className="text-2xl font-semibold text-white">{formatTime(stats.sessionTime)}</p>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Avatar</p>
                <p className="text-lg font-medium text-white">
                  {isAvatarSelected ? avatarData?.name : 'None'}
                </p>
              </div>
              {isAvatarSelected && (
                <AvatarDisplay
                  avatarId={selectedAvatar!}
                  size={40}
                  variant="simple"
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800 border border-gray-700 rounded-lg p-1">
          {[
            { id: 'gallery', name: 'Avatar Gallery', icon: '👥' },
            { id: 'customizer', name: 'Customizer', icon: '⚙️' },
            { id: 'analytics', name: 'Analytics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Choose Your Avatar</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const randomId = getRandomAvatar();
                      handleAvatarSelect(randomId);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Random Pick
                  </button>
                  {isAvatarSelected && (
                    <button
                      onClick={clearAvatar}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              </div>
              <AvatarGallery
                onAvatarSelect={handleAvatarSelect}
                selectedAvatarId={selectedAvatar || undefined}
              />
            </div>
          )}

          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Customize Your Profile</h2>
              <AvatarCustomizer
                initialAvatarId={selectedAvatar || undefined}
                onSave={handleAvatarSave}
                onCancel={() => setActiveTab('gallery')}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Avatar Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usage Chart */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Selection History</h3>
                  <div className="space-y-3">
                    {stats.totalSelections > 0 ? (
                      <div className="text-gray-300">
                        <p>Total avatar changes: {stats.totalSelections}</p>
                        <p>Customization sessions: {stats.customizations}</p>
                        <p>Time spent customizing: {formatTime(stats.sessionTime)}</p>
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-400 mb-2">Current Selection:</p>
                          {isAvatarSelected && (
                            <div className="flex items-center space-x-3">
                              <AvatarDisplay
                                avatarId={selectedAvatar!}
                                size={48}
                                variant="simple"
                              />
                              <div>
                                <p className="font-medium text-white">{avatarData?.name}</p>
                                <p className="text-sm text-gray-400">{avatarData?.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">No selections made yet. Start by choosing an avatar!</p>
                    )}
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Display Name</span>
                      <span className="text-white font-medium">{userName || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Avatar Status</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        isAvatarSelected 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {isAvatarSelected ? 'Active' : 'None Selected'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Engagement Level</span>
                      <span className="text-white font-medium">
                        {stats.totalSelections > 5 ? 'High' : stats.totalSelections > 2 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 