import React, { useState } from 'react';
import { AvatarId } from '../components/avatars/AvatarTypes';
import { AvatarGallery } from '../components/avatars/AvatarGallery';
import { AvatarCustomizer } from '../components/avatars/AvatarCustomizer';
import { AvatarDisplay } from '../components/avatars/AvatarDisplay';
import { useAvatar } from '../hooks/useAvatar';

export default function AvatarDemo() {
  const {
    selectedAvatar,
    setSelectedAvatar,
    clearAvatar,
    isAvatarSelected,
    getRandomAvatar,
    avatarData
  } = useAvatar();

  const [activeTab, setActiveTab] = useState<'gallery' | 'customizer' | 'showcase'>('gallery');
  const [userName, setUserName] = useState('Adventure Seeker');

  const handleRandomAvatar = () => {
    const randomAvatarId = getRandomAvatar();
    setSelectedAvatar(randomAvatarId);
  };

  const handleAvatarSave = (avatarId: AvatarId, displayName: string) => {
    setSelectedAvatar(avatarId);
    setUserName(displayName);
    setActiveTab('showcase');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GoFind Avatar System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive avatar system with 6 hand-crafted SVG characters, 
            complete customization options, and seamless integration capabilities.
          </p>
        </div>

        {/* Current Selection Display */}
        {isAvatarSelected && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AvatarDisplay
                  avatarId={selectedAvatar!}
                  size={60}
                  showName={true}
                  userName={userName}
                  variant="compact"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleRandomAvatar}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Random Avatar
                </button>
                <button
                  onClick={clearAvatar}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('customizer')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'customizer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Customizer
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'showcase'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Showcase
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'gallery' && (
            <AvatarGallery
              onAvatarSelect={setSelectedAvatar}
              selectedAvatarId={selectedAvatar || undefined}
            />
          )}

          {activeTab === 'customizer' && (
            <AvatarCustomizer
              initialAvatarId={selectedAvatar || undefined}
              onSave={handleAvatarSave}
              onCancel={() => setActiveTab('gallery')}
            />
          )}

          {activeTab === 'showcase' && (
            <div className="space-y-8">
              {/* Different Display Variants */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Avatar Display Variants
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedAvatar && (
                    <>
                      <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Simple</h4>
                        <AvatarDisplay
                          avatarId={selectedAvatar}
                          size={80}
                          variant="simple"
                          className="mx-auto"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Compact</h4>
                        <AvatarDisplay
                          avatarId={selectedAvatar}
                          size={60}
                          showName={true}
                          userName={userName}
                          variant="compact"
                          className="mx-auto"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Card</h4>
                        <AvatarDisplay
                          avatarId={selectedAvatar}
                          size={80}
                          showName={true}
                          showDescription={true}
                          userName={userName}
                          variant="card"
                          className="mx-auto"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Avatar Sizes Demo */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Size Variations
                </h3>
                {selectedAvatar && (
                  <div className="flex items-end justify-center space-x-8">
                    {[40, 60, 80, 100, 120].map(size => (
                      <div key={size} className="text-center">
                        <AvatarDisplay
                          avatarId={selectedAvatar}
                          size={size}
                          variant="simple"
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">{size}px</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technical Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  System Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Avatar Components</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ 6 Hand-crafted SVG Avatars</li>
                      <li>✅ Unified Avatar Component</li>
                      <li>✅ Avatar Selector Interface</li>
                      <li>✅ Avatar Customizer</li>
                      <li>✅ Avatar Gallery</li>
                      <li>✅ Display Variants</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Technical Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ TypeScript Support</li>
                      <li>✅ React Hooks Integration</li>
                      <li>✅ LocalStorage Persistence</li>
                      <li>✅ Responsive Design</li>
                      <li>✅ CSS Animations</li>
                      <li>✅ Modular Architecture</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            This avatar system represents approximately 6 hours of development work,
            including SVG design, component architecture, state management, and UI polish.
          </p>
        </div>
      </div>
    </div>
  );
} 