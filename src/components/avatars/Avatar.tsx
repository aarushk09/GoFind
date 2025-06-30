import React from 'react';
import { AvatarId, AvatarProps } from './AvatarTypes';
import { getAvatarComponent } from './index';

interface UnifiedAvatarProps extends AvatarProps {
  avatarId: AvatarId;
  animated?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const Avatar: React.FC<UnifiedAvatarProps> = ({ 
  avatarId, 
  size = 100, 
  className = '', 
  animated = false,
  onClick,
  selected = false 
}) => {
  const AvatarComponent = getAvatarComponent(avatarId);
  
  const combinedClassName = [
    'avatar-container',
    animated ? 'avatar-animated' : '',
    onClick ? 'cursor-pointer' : '',
    selected ? 'avatar-selected' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={combinedClassName}
      onClick={onClick}
      style={{
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.1)' : 'scale(1)',
        filter: selected ? 'drop-shadow(0 0 10px rgba(74, 144, 226, 0.6))' : 'none',
      }}
    >
      <AvatarComponent size={size} className="avatar-svg" />
    </div>
  );
};

export default Avatar; 