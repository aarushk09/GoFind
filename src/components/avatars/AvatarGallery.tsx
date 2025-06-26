import React, { useState } from 'react';
import { AvatarId, avatarList } from './AvatarTypes';
import { Avatar } from './Avatar';

interface AvatarGalleryProps {
  onAvatarSelect?: (avatarId: AvatarId) => void;
  selectedAvatarId?: AvatarId;
  className?: string;
}

export const AvatarGallery: React.FC<AvatarGalleryProps> = ({
  onAvatarSelect,
  selectedAvatarId,
  className = ''
}) => {
  const [focusedAvatar, setFocusedAvatar] = useState<AvatarId | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAvatarClick = (avatarId: AvatarId) => {
    if (onAvatarSelect) {
      onAvatarSelect(avatarId);
    } else {
      setFocusedAvatar(focusedAvatar === avatarId ? null : avatarId);
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {avatarList.map((avatar) => (
        <div
          key={avatar.id}
          className={`avatar-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
            selectedAvatarId === avatar.id ? 'ring-2 ring-blue-500' : ''
          } ${focusedAvatar === avatar.id ? 'scale-105' : ''}`}
          onClick={() => handleAvatarClick(avatar.id)}
        >
          <div className="p-6 text-center">
            <div className="mb-4">
              <Avatar 
                avatarId={avatar.id} 
                size={100} 
                selected={selectedAvatarId === avatar.id}
                className="mx-auto"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {avatar.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {avatar.description}
            </p>
            {selectedAvatarId === avatar.id && (
              <div className="mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Selected
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {avatarList.map((avatar) => (
        <div
          key={avatar.id}
          className={`avatar-list-item bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
            selectedAvatarId === avatar.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => handleAvatarClick(avatar.id)}
        >
          <div className="p-4 flex items-center space-x-4">
            <Avatar 
              avatarId={avatar.id} 
              size={80} 
              selected={selectedAvatarId === avatar.id}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {avatar.name}
              </h3>
              <p className="text-sm text-gray-600">
                {avatar.description}
              </p>
            </div>
            {selectedAvatarId === avatar.id && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Selected
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`avatar-gallery ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Avatar Gallery</h2>
          <p className="text-gray-600 mt-1">Choose your perfect adventure companion</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Avatar Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{avatarList.length}</div>
            <div className="text-sm text-gray-600">Total Avatars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Unique Styles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-gray-600">Possibilities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-gray-600">Hand-crafted</div>
          </div>
        </div>
      </div>

      {/* Avatar Display */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Focused Avatar Modal */}
      {focusedAvatar && !onAvatarSelect && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setFocusedAvatar(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Avatar avatarId={focusedAvatar} size={150} className="mx-auto mb-4" />
              {(() => {
                const avatar = avatarList.find(a => a.id === focusedAvatar);
                return avatar ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {avatar.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {avatar.description}
                    </p>
                  </>
                ) : null;
              })()}
              <button
                onClick={() => setFocusedAvatar(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGallery; 