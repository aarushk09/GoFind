import React, { useState } from 'react';
import { AvatarId, avatarList } from './AvatarTypes';
import { Avatar } from './Avatar';

interface AvatarSelectorProps {
  selectedAvatarId?: AvatarId;
  onAvatarSelect: (avatarId: AvatarId) => void;
  size?: number;
  showNames?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatarId,
  onAvatarSelect,
  size = 80,
  showNames = true,
  showDescriptions = false,
  className = ''
}) => {
  const [hoveredAvatar, setHoveredAvatar] = useState<AvatarId | null>(null);

  return (
    <div className={`avatar-selector ${className}`}>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
        {avatarList.map((avatar) => (
          <div
            key={avatar.id}
            className="avatar-option flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-gray-600"
            onMouseEnter={() => setHoveredAvatar(avatar.id)}
            onMouseLeave={() => setHoveredAvatar(null)}
          >
            <Avatar
              avatarId={avatar.id}
              size={size}
              selected={selectedAvatarId === avatar.id}
              animated={hoveredAvatar === avatar.id}
              onClick={() => onAvatarSelect(avatar.id)}
              className="mb-2"
            />
            {showNames && (
              <h3 className="text-sm font-medium text-white text-center">
                {avatar.name}
              </h3>
            )}
            {showDescriptions && (
              <p className="text-xs text-gray-300 text-center mt-1">
                {avatar.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector; 