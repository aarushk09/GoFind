import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars'
  color?: 'blue' | 'green' | 'red' | 'gray' | 'white'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'blue',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'text-blue-600 border-blue-600',
    green: 'text-green-600 border-green-600',
    red: 'text-red-600 border-red-600',
    gray: 'text-gray-600 border-gray-600',
    white: 'text-white border-white'
  }

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${baseClasses} border-2 border-t-transparent rounded-full animate-spin`} />
        )
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size].replace('w-', 'w-').replace('h-', 'w-')} ${colorClasses[color].split(' ')[0]} rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${baseClasses} bg-current rounded-full animate-pulse`} />
        )
      
      case 'bars':
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 ${colorClasses[color].split(' ')[0]} animate-bounce`}
                style={{
                  height: size === 'sm' ? '8px' : size === 'md' ? '12px' : size === 'lg' ? '16px' : '20px',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        )
      
      default:
        return (
          <div className={`${baseClasses} border-2 border-t-transparent rounded-full animate-spin`} />
        )
    }
  }

  if (text) {
    return (
      <div className="flex items-center space-x-3">
        {renderSpinner()}
        <span className={`text-${color}-600 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
          {text}
        </span>
      </div>
    )
  }

  return renderSpinner()
}

export default LoadingSpinner 