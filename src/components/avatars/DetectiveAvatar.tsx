import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const DetectiveAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="detectiveSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5DEB3" />
        <stop offset="100%" stopColor="#DEB887" />
      </linearGradient>
      <linearGradient id="detectiveCoat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A4A4A" />
        <stop offset="100%" stopColor="#2C2C2C" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#F0F8FF" stroke="#B8B8DC" strokeWidth="3"/>
    
    {/* Trench Coat */}
    <rect x="70" y="140" width="60" height="55" rx="8" fill="url(#detectiveCoat)"/>
    <rect x="75" y="145" width="50" height="45" rx="5" fill="#5A5A5A"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="42" fill="url(#detectiveSkin)" stroke="#CD853F" strokeWidth="2"/>
    
    {/* Detective Hat */}
    <ellipse cx="100" cy="75" rx="45" ry="12" fill="#2F2F2F"/>
    <rect x="60" y="63" width="80" height="20" rx="10" fill="#2F2F2F"/>
    <ellipse cx="100" cy="63" rx="40" ry="8" fill="#404040"/>
    
    {/* Hat Band */}
    <rect x="65" y="69" width="70" height="4" fill="#8B0000"/>
    
    {/* Eyes with glasses */}
    <circle cx="85" cy="105" r="12" fill="#FFF" stroke="#000" strokeWidth="2"/>
    <circle cx="115" cy="105" r="12" fill="#FFF" stroke="#000" strokeWidth="2"/>
    <line x1="97" y1="105" x2="103" y2="105" stroke="#000" strokeWidth="2"/>
    <line x1="73" y1="105" x2="65" y2="100" stroke="#000" strokeWidth="2"/>
    <line x1="127" y1="105" x2="135" y2="100" stroke="#000" strokeWidth="2"/>
    
    {/* Pupils */}
    <circle cx="88" cy="105" r="5" fill="#228B22"/>
    <circle cx="112" cy="105" r="5" fill="#228B22"/>
    <circle cx="89" cy="103" r="1.5" fill="#FFF"/>
    <circle cx="113" cy="103" r="1.5" fill="#FFF"/>
    
    {/* Mustache */}
    <path d="M 88 120 Q 100 125 112 120 Q 108 123 100 123 Q 92 123 88 120" fill="#654321"/>
    
    {/* Nose */}
    <polygon points="100,115 95,118 100,125 105,118" fill="#CD853F"/>
    
    {/* Mouth */}
    <path d="M 90 135 Q 100 140 110 135" stroke="#8B4513" strokeWidth="2" fill="none"/>
    
    {/* Magnifying Glass */}
    <circle cx="140" cy="130" r="15" fill="none" stroke="#DAA520" strokeWidth="3"/>
    <circle cx="140" cy="130" r="12" fill="rgba(173,216,230,0.3)"/>
    <line x1="152" y1="142" x2="165" y2="155" stroke="#8B4513" strokeWidth="4"/>
    <circle cx="165" cy="155" r="3" fill="#654321"/>
    
    {/* Pipe */}
    <rect x="110" y="128" width="20" height="4" rx="2" fill="#8B4513"/>
    <ellipse cx="130" cy="130" rx="4" ry="6" fill="#654321"/>
  </svg>
); 