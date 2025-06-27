import React, { useState } from 'react';
import { AvatarId, avatarList } from './AvatarTypes';
import { Avatar } from './Avatar';
import { AvatarSelector } from './AvatarSelector';

interface AvatarCustomizerProps {
  initialAvatarId?: AvatarId;
  onSave: (avatarId: AvatarId, displayName: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  initialAvatarId,
  onSave,
  onCancel,
  className = ''
}) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>(
    initialAvatarId || avatarList[0].id
  );
  const [displayName, setDisplayName] = useState('');
  const [previewSize, setPreviewSize] = useState(120);

  const selectedAvatarData = avatarList.find(avatar => avatar.id === selectedAvatarId);

  const handleSave = () => {
    if (displayName.trim() && selectedAvatarId) {
      onSave(selectedAvatarId, displayName.trim());
    }
  };

  return (
    <div className={`avatar-customizer bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 max-w-2xl mx-auto ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Customize Your Avatar
      </h2>

      {/* Preview Section */}
      <div className="avatar-preview mb-8 text-center">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 mb-4">
          <Avatar 
            avatarId={selectedAvatarId} 
            size={previewSize}
            className="mx-auto"
          />
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <label className="text-sm text-gray-300">Preview Size:</label>
          <input
            type="range"
            min="80"
            max="160"
            value={previewSize}
            onChange={(e) => setPreviewSize(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-400">{previewSize}px</span>
        </div>

        {selectedAvatarData && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">{selectedAvatarData.name}</h3>
            <p className="text-sm text-gray-300">{selectedAvatarData.description}</p>
          </div>
        )}
      </div>

      {/* Display Name Input */}
      <div className="mb-6">
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name..."
          className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          maxLength={20}
        />
        <p className="text-xs text-gray-400 mt-1">
          {displayName.length}/20 characters
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Choose Your Avatar</h3>
        <AvatarSelector
          selectedAvatarId={selectedAvatarId}
          onAvatarSelect={setSelectedAvatarId}
          size={60}
          showNames={true}
          className="border border-gray-600 bg-gray-700 rounded-lg p-4"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!displayName.trim()}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            displayName.trim()
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer; 