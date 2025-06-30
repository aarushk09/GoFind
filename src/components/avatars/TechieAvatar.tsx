import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const TechieAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="techieSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE4B5" />
        <stop offset="100%" stopColor="#DDD8C7" />
      </linearGradient>
      <linearGradient id="techieHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4169E1" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#F8F8FF" stroke="#E6E6FA" strokeWidth="3"/>
    
    {/* Hoodie */}
    <rect x="70" y="140" width="60" height="55" rx="12" fill="url(#techieHoodie)"/>
    <rect x="75" y="145" width="50" height="45" rx="8" fill="#3B82F6"/>
    <path d="M 70 140 Q 100 130 130 140 L 125 150 Q 100 145 75 150 Z" fill="#1E3A8A"/>
    
    {/* Hood */}
    <path d="M 75 85 Q 100 70 125 85 Q 120 90 100 90 Q 80 90 75 85" fill="#1E3A8A"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="38" fill="url(#techieSkin)" stroke="#D2B48C" strokeWidth="2"/>
    
    {/* Hair (messy, under hood) */}
    <path d="M 80 90 Q 85 85 90 88 Q 95 83 100 88 Q 105 83 110 88 Q 115 85 120 90" 
          stroke="#654321" strokeWidth="3" fill="none"/>
    
    {/* Smart Glasses */}
    <rect x="75" y="100" width="22" height="15" rx="7" fill="rgba(0,0,0,0.1)" stroke="#2C3E50" strokeWidth="2"/>
    <rect x="103" y="100" width="22" height="15" rx="7" fill="rgba(0,0,0,0.1)" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="97" y1="107" x2="103" y2="107" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="75" y1="107" x2="68" y2="110" stroke="#2C3E50" strokeWidth="2"/>
    <line x1="125" y1="107" x2="132" y2="110" stroke="#2C3E50" strokeWidth="2"/>
    
    {/* LED on glasses */}
    <circle cx="70" cy="105" r="2" fill="#00FF00"/>
    <circle cx="130" cy="105" r="2" fill="#00FF00"/>
    
    {/* Eyes */}
    <circle cx="86" cy="107" r="5" fill="#FFF"/>
    <circle cx="114" cy="107" r="5" fill="#FFF"/>
    <circle cx="86" cy="107" r="3" fill="#4A90E2"/>
    <circle cx="114" cy="107" r="3" fill="#4A90E2"/>
    <circle cx="87" cy="106" r="1" fill="#FFF"/>
    <circle cx="115" cy="106" r="1" fill="#FFF"/>
    
    {/* Nose */}
    <ellipse cx="100" cy="117" rx="2.5" ry="4" fill="#D2B48C"/>
    
    {/* Mouth */}
    <path d="M 92 127 Q 100 130 108 127" stroke="#A0522D" strokeWidth="2" fill="none"/>
    
    {/* Smartphone */}
    <rect x="130" y="130" width="12" height="20" rx="3" fill="#2C3E50"/>
    <rect x="132" y="132" width="8" height="16" rx="1" fill="#00BFFF"/>
    <circle cx="136" cy="147" r="1" fill="#FFF"/>
    
    {/* Smartwatch */}
    <rect x="70" y="135" width="8" height="6" rx="2" fill="#2C3E50"/>
    <rect x="71" y="136" width="6" height="4" rx="1" fill="#00FF7F"/>
    <ellipse cx="69" cy="138" rx="3" ry="8" fill="#1A1A1A"/>
    
    {/* Earbuds */}
    <circle cx="75" cy="95" r="3" fill="#FFF"/>
    <circle cx="125" cy="95" r="3" fill="#FFF"/>
    <path d="M 75 98 Q 80 105 85 110" stroke="#FFF" strokeWidth="2" fill="none"/>
    <path d="M 125 98 Q 120 105 115 110" stroke="#FFF" strokeWidth="2" fill="none"/>
  </svg>
); 