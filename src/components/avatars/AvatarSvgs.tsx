import React from 'react';

export interface AvatarProps {
  size?: number;
  className?: string;
}

// Avatar 1: The Explorer - Adventure themed with compass and hiking gear
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

// Avatar 2: The Detective - Mystery solver with magnifying glass
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

// Avatar 3: The Scholar - Academic with books and graduation cap
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
    <text x="41" y="130" textAnchor="middle" fontSize="6" fill="#654321">📖</text>
    
    {/* Scroll */}
    <rect x="155" y="125" width="15" height="4" rx="2" fill="#F5DEB3"/>
    <circle cx="155" cy="127" r="2" fill="#DEB887"/>
    <circle cx="170" cy="127" r="2" fill="#DEB887"/>
  </svg>
);

// Avatar 4: The Adventurer - Action-ready with map and compass
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

// Avatar 5: The Techie - Modern tech enthusiast with gadgets
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

// Avatar 6: The Artist - Creative type with paint and brushes
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

export const avatarList = [
  { id: 'explorer', name: 'Explorer', component: ExplorerAvatar, description: 'Adventure seeker with compass and hiking gear' },
  { id: 'detective', name: 'Detective', component: DetectiveAvatar, description: 'Mystery solver with magnifying glass' },
  { id: 'scholar', name: 'Scholar', component: ScholarAvatar, description: 'Academic with books and graduation cap' },
  { id: 'adventurer', name: 'Adventurer', component: AdventurerAvatar, description: 'Action-ready with map and compass' },
  { id: 'techie', name: 'Techie', component: TechieAvatar, description: 'Tech enthusiast with smart gadgets' },
  { id: 'artist', name: 'Artist', component: ArtistAvatar, description: 'Creative type with paint and brushes' }
] as const;

export type AvatarId = typeof avatarList[number]['id']; 