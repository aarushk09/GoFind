import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const ExplorerAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="explorerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFDBAC" />
        <stop offset="100%" stopColor="#F4C2A1" />
      </linearGradient>
      <linearGradient id="explorerHat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#654321" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#E8F4FD" stroke="#B8E6B8" strokeWidth="3"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="45" fill="url(#explorerSkin)" stroke="#E0A080" strokeWidth="2"/>
    
    {/* Explorer Hat */}
    <ellipse cx="100" cy="75" rx="48" ry="15" fill="url(#explorerHat)"/>
    <rect x="52" y="60" width="96" height="25" rx="12" fill="url(#explorerHat)"/>
    
    {/* Hat Band */}
    <rect x="55" y="68" width="90" height="6" fill="#DAA520"/>
    
    {/* Compass on hat */}
    <circle cx="85" cy="71" r="6" fill="#DAA520" stroke="#B8860B" strokeWidth="1"/>
    <circle cx="85" cy="71" r="3" fill="#FFF"/>
    <line x1="85" y1="68" x2="85" y2="74" stroke="#B8860B" strokeWidth="1"/>
    <line x1="82" y1="71" x2="88" y2="71" stroke="#B8860B" strokeWidth="1"/>
    
    {/* Eyes */}
    <circle cx="90" cy="105" r="6" fill="#FFF"/>
    <circle cx="110" cy="105" r="6" fill="#FFF"/>
    <circle cx="90" cy="105" r="3" fill="#4A90E2"/>
    <circle cx="110" cy="105" r="3" fill="#4A90E2"/>
    <circle cx="91" cy="104" r="1" fill="#FFF"/>
    <circle cx="111" cy="104" r="1" fill="#FFF"/>
    
    {/* Eyebrows */}
    <path d="M 84 98 Q 90 95 96 98" stroke="#A0522D" strokeWidth="2" fill="none"/>
    <path d="M 104 98 Q 110 95 116 98" stroke="#A0522D" strokeWidth="2" fill="none"/>
    
    {/* Nose */}
    <ellipse cx="100" cy="115" rx="3" ry="5" fill="#E0A080"/>
    
    {/* Mouth */}
    <path d="M 92 125 Q 100 130 108 125" stroke="#D2691E" strokeWidth="2" fill="none"/>
    
    {/* Beard */}
    <path d="M 85 140 Q 100 150 115 140 Q 110 145 100 147 Q 90 145 85 140" fill="#8B4513"/>
    
    {/* Adventure Gear - Binoculars around neck */}
    <rect x="88" y="155" width="8" height="12" rx="3" fill="#2F4F4F"/>
    <rect x="104" y="155" width="8" height="12" rx="3" fill="#2F4F4F"/>
    <line x1="96" y1="160" x2="104" y2="160" stroke="#696969" strokeWidth="2"/>
    <path d="M 85 155 Q 100 150 115 155" stroke="#8B4513" strokeWidth="2" fill="none"/>
  </svg>
); 