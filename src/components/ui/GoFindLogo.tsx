import React from 'react'

interface GoFindLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  textColor?: string
}

export const GoFindLogo: React.FC<GoFindLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  textColor = 'text-gray-900'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Clean Location Pin Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            fill="#8B5CF6"
          />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-black ${textSizeClasses[size]} ${textColor} tracking-tight`}>
          GoFind
        </span>
      )}
    </div>
  )
}

export default GoFindLogo 