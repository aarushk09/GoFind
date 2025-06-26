import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const ScholarAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="scholarSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEAA7" />
        <stop offset="100%" stopColor="#FDCB6E" />
      </linearGradient>
      <linearGradient id="scholarRobe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2C3E50" />
        <stop offset="100%" stopColor="#34495E" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#FFF5EE" stroke="#DDD8C7" strokeWidth="3"/>
    
    {/* Academic Robe */}
    <rect x="65" y="140" width="70" height="55" rx="10" fill="url(#scholarRobe)"/>
    <polygon points="75,145 85,140 115,140 125,145 125,195 75,195" fill="#1A252F"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="40" fill="url(#scholarSkin)" stroke="#E17055" strokeWidth="2"/>
    
    {/* Graduation Cap */}
    <rect x="55" y="70" width="90" height="8" rx="4" fill="#2C3E50"/>
    <polygon points="50,70 150,70 140,60 60,60" fill="#34495E"/>
    <rect x="145" y="55" width="3" height="20" fill="#E74C3C"/>
    <polygon points="148,55 155,52 155,58" fill="#E74C3C"/>
    
    {/* Hair */}
    <path d="M 65 85 Q 100 75 135 85 Q 130 80 100 75 Q 70 80 65 85" fill="#8B4513"/>
    
    {/* Eyes */}
    <circle cx="88" cy="105" r="6" fill="#FFF"/>
    <circle cx="112" cy="105" r="6" fill="#FFF"/>
    <circle cx="88" cy="105" r="4" fill="#6C5CE7"/>
    <circle cx="112" cy="105" r="4" fill="#6C5CE7"/>
    <circle cx="89" cy="103" r="1" fill="#FFF"/>
    <circle cx="113" cy="103" r="1" fill="#FFF"/>
    
    {/* Round Glasses */}
    <circle cx="88" cy="105" r="10" fill="none" stroke="#2C3E50" strokeWidth="2"/>
    <circle cx="112" cy="105" r="10" fill="none" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="98" y1="105" x2="102" y2="105" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="78" y1="108" x2="70" y2="110" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="122" y1="108" x2="130" y2="110" stroke="#2C3E50" strokeWidth="2"/>
    
    {/* Eyebrows */}
    <path d="M 78 95 Q 88 92 98 95" stroke="#654321" strokeWidth="2" fill="none"/>
    <path d="M 102 95 Q 112 92 122 95" stroke="#654321" strokeWidth="2" fill="none"/>
    
    {/* Nose */}
    <ellipse cx="100" cy="115" rx="3" ry="6" fill="#E17055"/>
    
    {/* Mouth */}
    <path d="M 90 125 Q 100 130 110 125" stroke="#A0522D" strokeWidth="2" fill="none"/>
    
    {/* Book in hand */}
    <rect x="35" y="120" width="12" height="18" rx="2" fill="#8B4513"/>
    <rect x="36" y="121" width="10" height="16" rx="1" fill="#DEB887"/>
    <line x1="41" y1="121" x2="41" y2="137" stroke="#8B4513" strokeWidth="1"/>
    
    {/* Scroll */}
    <rect x="155" y="125" width="15" height="4" rx="2" fill="#F5DEB3"/>
    <circle cx="155" cy="127" r="2" fill="#DEB887"/>
    <circle cx="170" cy="127" r="2" fill="#DEB887"/>
  </svg>
); 