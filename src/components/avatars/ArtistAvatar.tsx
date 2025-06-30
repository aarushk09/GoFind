import React from 'react';
import { AvatarProps } from './AvatarTypes';

export const ArtistAvatar: React.FC<AvatarProps> = ({ size = 100, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`avatar-svg ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="artistSkin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4C2A1" />
        <stop offset="100%" stopColor="#E6A876" />
      </linearGradient>
      <linearGradient id="artistSmock" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF8DC" />
        <stop offset="100%" stopColor="#F5F5DC" />
      </linearGradient>
    </defs>
    
    {/* Background Circle */}
    <circle cx="100" cy="100" r="95" fill="#FFF0F5" stroke="#FFB6C1" strokeWidth="3"/>
    
    {/* Paint splatters on background */}
    <circle cx="160" cy="60" r="4" fill="#FF69B4" opacity="0.7"/>
    <circle cx="40" cy="170" r="3" fill="#32CD32" opacity="0.7"/>
    <circle cx="170" cy="150" r="3" fill="#FFD700" opacity="0.7"/>
    <circle cx="30" cy="50" r="2" fill="#FF4500" opacity="0.7"/>
    
    {/* Artist Smock */}
    <rect x="70" y="140" width="60" height="55" rx="10" fill="url(#artistSmock)"/>
    <rect x="75" y="145" width="50" height="45" rx="6" fill="#FFFACD"/>
    
    {/* Paint stains on smock */}
    <circle cx="85" cy="155" r="3" fill="#FF1493" opacity="0.6"/>
    <circle cx="105" cy="165" r="2" fill="#00CED1" opacity="0.6"/>
    <circle cx="115" cy="150" r="2.5" fill="#FF8C00" opacity="0.6"/>
    
    {/* Face */}
    <circle cx="100" cy="110" r="40" fill="url(#artistSkin)" stroke="#CD853F" strokeWidth="2"/>
    
    {/* Beret */}
    <circle cx="95" cy="80" r="30" fill="#8B008B"/>
    <circle cx="95" cy="80" r="25" fill="#9932CC"/>
    <circle cx="110" cy="70" r="4" fill="#8B008B"/>
    
    {/* Hair flowing from beret */}
    <path d="M 70 85 Q 65 90 70 95 Q 75 100 80 95" stroke="#8B4513" strokeWidth="4" fill="none"/>
    <path d="M 120 85 Q 125 90 120 95 Q 115 100 120 95" stroke="#8B4513" strokeWidth="4" fill="none"/>
    
    {/* Eyes */}
    <circle cx="90" cy="105" r="6" fill="#FFF"/>
    <circle cx="110" cy="105" r="6" fill="#FFF"/>
    <circle cx="90" cy="105" r="4" fill="#9370DB"/>
    <circle cx="110" cy="105" r="4" fill="#9370DB"/>
    <circle cx="91" cy="103" r="1" fill="#FFF"/>
    <circle cx="111" cy="103" r="1" fill="#FFF"/>
    
    {/* Eyebrows */}
    <path d="M 82 98 Q 90 94 98 98" stroke="#8B4513" strokeWidth="2" fill="none"/>
    <path d="M 102 98 Q 110 94 118 98" stroke="#8B4513" strokeWidth="2" fill="none"/>
    
    {/* Nose */}
    <ellipse cx="100" cy="115" rx="3" ry="5" fill="#CD853F"/>
    
    {/* Mouth */}
    <path d="M 88 125 Q 100 132 112 125" stroke="#B22222" strokeWidth="2" fill="none"/>
    
    {/* Paint brush in hand */}
    <rect x="125" y="120" width="3" height="25" fill="#8B4513"/>
    <rect x="122" y="115" width="9" height="8" rx="2" fill="#C0C0C0"/>
    <path d="M 125 115 L 125 110 L 127 108 L 129 110 L 129 115" fill="#FF69B4"/>
    
    {/* Palette */}
    <ellipse cx="140" cy="150" rx="18" ry="12" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="2"/>
    <circle cx="135" cy="145" r="2" fill="#FF0000"/>
    <circle cx="145" cy="145" r="2" fill="#0000FF"/>
    <circle cx="140" cy="155" r="2" fill="#FFFF00"/>
    <circle cx="130" cy="155" r="2" fill="#008000"/>
    <circle cx="150" cy="155" r="2" fill="#FFA500"/>
    
    {/* Thumb hole in palette */}
    <ellipse cx="142" cy="150" rx="3" ry="2" fill="none" stroke="#D3D3D3" strokeWidth="2"/>
    
    {/* Paint smudge on cheek */}
    <circle cx="120" cy="100" r="2" fill="#FF1493" opacity="0.4"/>
  </svg>
); 