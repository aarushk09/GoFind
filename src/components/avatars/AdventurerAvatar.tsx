import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const AdventurerAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="adventurerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4A574" />
        <stop offset="100%" stopColor="#C19653" />
      </linearGradient>
      <linearGradient id="adventurerVest" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8FBC8F" />
        <stop offset="100%" stopColor="#6B8E6B" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#F0FFFF" stroke="#B8FFC8" strokeWidth="3"/>
    
    {/* Adventure Vest */}
    <rect x="75" y="140" width="50" height="55" rx="8" fill="url(#adventurerVest)"/>
    <rect x="80" y="145" width="40" height="45" rx="5" fill="#9ACD32"/>
    
    {/* Vest Pockets */}
    <rect x="82" y="150" width="15" height="10" rx="2" fill="#6B8E6B"/>
    <rect x="103" y="150" width="15" height="10" rx="2" fill="#6B8E6B"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="40" fill="url(#adventurerSkin)" stroke="#B8860B" strokeWidth="2"/>
    
    {/* Bandana */}
    <path d="M 65 85 Q 100 70 135 85 Q 130 75 100 70 Q 70 75 65 85" fill="#FF6347"/>
    <polygon points="135,85 145,80 140,90" fill="#FF6347"/>
    <circle cx="75" cy="80" r="2" fill="#FFD700"/>
    <circle cx="95" cy="75" r="2" fill="#FFD700"/>
    <circle cx="115" cy="78" r="2" fill="#FFD700"/>
    
    {/* Eyes */}
    <circle cx="90" cy="105" r="6" fill="#FFF"/>
    <circle cx="110" cy="105" r="6" fill="#FFF"/>
    <circle cx="90" cy="105" r="4" fill="#228B22"/>
    <circle cx="110" cy="105" r="4" fill="#228B22"/>
    <circle cx="91" cy="103" r="1" fill="#FFF"/>
    <circle cx="111" cy="103" r="1" fill="#FFF"/>
    
    {/* Eyebrows */}
    <path d="M 82 98 Q 90 95 98 98" stroke="#8B4513" strokeWidth="2" fill="none"/>
    <path d="M 102 98 Q 110 95 118 98" stroke="#8B4513" strokeWidth="2" fill="none"/>
    
    {/* Nose */}
    <ellipse cx="100" cy="115" rx="3" ry="5" fill="#B8860B"/>
    
    {/* Mouth */}
    <path d="M 88 125 Q 100 132 112 125" stroke="#8B4513" strokeWidth="2" fill="none"/>
    
    {/* Compass in hand */}
    <circle cx="130" cy="140" r="12" fill="#DAA520" stroke="#B8860B" strokeWidth="2"/>
    <circle cx="130" cy="140" r="8" fill="#FFF"/>
    <line x1="130" y1="132" x2="130" y2="148" stroke="#B8860B" strokeWidth="1"/>
    <line x1="122" y1="140" x2="138" y2="140" stroke="#B8860B" strokeWidth="1"/>
    <polygon points="130,135 132,140 130,145 128,140" fill="#FF0000"/>
    
    {/* Map in other hand */}
    <rect x="55" y="130" width="18" height="15" rx="2" fill="#F5DEB3" transform="rotate(-15 64 137.5)"/>
    <line x1="58" y1="135" x2="68" y2="135" stroke="#8B4513" strokeWidth="1" transform="rotate(-15 64 137.5)"/>
    <line x1="58" y1="140" x2="65" y2="140" stroke="#8B4513" strokeWidth="1" transform="rotate(-15 64 137.5)"/>
    <circle cx="62" cy="138" r="1.5" fill="#FF0000" transform="rotate(-15 64 137.5)"/>
  </svg>
); 