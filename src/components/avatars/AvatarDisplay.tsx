import React from 'react';
import { AvatarId } from './AvatarTypes';
import { Avatar } from './Avatar';

interface AvatarDisplayProps {
  avatarId: AvatarId;
  size?: number;
  showName?: boolean;
  showDescription?: boolean;
  userName?: string;
  variant?: 'simple' | 'card' | 'compact';
  className?: string;
  onClick?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarId,
  size = 60,
  showName = false,
  showDescription = false,
  userName,
  variant = 'simple',
  className = '',
  onClick
}) => {
  const avatarData = require('./AvatarTypes').avatarList.find((avatar: any) => avatar.id === avatarId);

  if (variant === 'simple') {
    return (
      <div className={`avatar-display-simple ${className}`} onClick={onClick}>
        <Avatar avatarId={avatarId} size={size} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`avatar-display-compact flex items-center space-x-3 ${className}`}
        onClick={onClick}
      >
        <Avatar avatarId={avatarId} size={size} />
        {(showName || userName) && (
          <div className="flex flex-col">
            {userName && (
              <span className="text-sm font-medium text-gray-900">{userName}</span>
            )}
            {showName && avatarData && (
              <span className="text-xs text-gray-500">{avatarData.name}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Card variant
  return (
    <div 
      className={`avatar-display-card bg-white rounded-lg shadow-md p-4 text-center max-w-xs ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-center mb-3">
        <Avatar avatarId={avatarId} size={size} />
      </div>
      
      {userName && (
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{userName}</h3>
      )}
      
      {showName && avatarData && (
        <p className="text-sm font-medium text-blue-600 mb-2">{avatarData.name}</p>
      )}
      
      {showDescription && avatarData && (
        <p className="text-xs text-gray-600">{avatarData.description}</p>
      )}
    </div>
  );
};

export default AvatarDisplay; 