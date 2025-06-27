import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

// Toast Context
const ToastContext = React.createContext<ToastContextType | null>(null)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Individual Toast Component
const Toast: React.FC<ToastProps> = ({ toast, onClose, position }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (toast.persistent) return

    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.duration, toast.persistent])

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300) // Match animation duration
  }, [toast.id, onClose])

  const getToastStyles = () => {
    const baseStyles = "relative flex items-start space-x-3 p-4 rounded-lg shadow-lg border max-w-sm w-full transition-all duration-300 transform"
    
    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800"
    }

    const animationStyles = isLeaving 
      ? "opacity-0 scale-95 translate-x-2" 
      : isVisible 
        ? "opacity-100 scale-100 translate-x-0" 
        : "opacity-0 scale-95 translate-x-2"

    return `${baseStyles} ${typeStyles[toast.type]} ${animationStyles}`
  }

  const getIconStyles = () => {
    const baseStyles = "flex-shrink-0 w-5 h-5 mt-0.5"
    const iconColors = {
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
      info: "text-blue-500"
    }
    return `${baseStyles} ${iconColors[toast.type]}`
  }

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className={getIconStyles()} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className={getIconStyles()} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className={getIconStyles()} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'info':
        return (
          <svg className={getIconStyles()} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={getToastStyles()}>
      {renderIcon()}
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{toast.title}</h4>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
        
        {toast.action && (
          <div className="mt-2">
            <button
              onClick={toast.action.onClick}
              className="text-xs font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Progress bar for timed toasts */}
      {!toast.persistent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-current opacity-50 rounded-b-lg"
            style={{
              animation: `toast-progress ${toast.duration || 5000}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  toasts: ToastData[]
  onClose: (id: string) => void
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position, toasts, onClose }) => {
  const getContainerStyles = () => {
    const baseStyles = "fixed z-50 flex flex-col space-y-3 pointer-events-none"
    
    const positionStyles = {
      'top-right': "top-4 right-4",
      'top-left': "top-4 left-4",
      'bottom-right': "bottom-4 right-4",
      'bottom-left': "bottom-4 left-4",
      'top-center': "top-4 left-1/2 transform -translate-x-1/2",
      'bottom-center': "bottom-4 left-1/2 transform -translate-x-1/2"
    }

    return `${baseStyles} ${positionStyles[position]}`
  }

  if (toasts.length === 0) return null

  return (
    <div className={getContainerStyles()}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={onClose} position={position} />
        </div>
      ))}
    </div>
  )
}

// Toast Provider Component
interface ToastProviderProps {
  children: React.ReactNode
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  maxToasts?: number
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setContainer(document.body)
  }, [])

  const addToast = useCallback((toastData: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastData = { ...toastData, id }

    setToasts(prev => {
      const updated = [...prev, newToast]
      // Limit number of toasts
      if (updated.length > maxToasts) {
        return updated.slice(-maxToasts)
      }
      return updated
    })

    return id
  }, [maxToasts])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {container && createPortal(
        <ToastContainer 
          position={position} 
          toasts={toasts} 
          onClose={removeToast} 
        />,
        container
      )}
    </ToastContext.Provider>
  )
}

// Convenience hook for common toast operations
export const useToastHelpers = () => {
  const { addToast } = useToast()

  return {
    success: (title: string, message?: string, options?: Partial<ToastData>) =>
      addToast({ type: 'success', title, message, ...options }),
    
    error: (title: string, message?: string, options?: Partial<ToastData>) =>
      addToast({ type: 'error', title, message, ...options }),
    
    warning: (title: string, message?: string, options?: Partial<ToastData>) =>
      addToast({ type: 'warning', title, message, ...options }),
    
    info: (title: string, message?: string, options?: Partial<ToastData>) =>
      addToast({ type: 'info', title, message, ...options }),

    promise: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      }
    ) => {
      const loadingId = addToast({
        type: 'info',
        title: messages.loading,
        persistent: true
      })

      try {
        const result = await promise
        const successMessage = typeof messages.success === 'function' 
          ? messages.success(result) 
          : messages.success
        
        addToast({
          type: 'success',
          title: successMessage
        })
        
        return result
      } catch (error) {
        const errorMessage = typeof messages.error === 'function'
          ? messages.error(error)
          : messages.error
        
        addToast({
          type: 'error',
          title: errorMessage
        })
        
        throw error
      } finally {
        // Remove loading toast
        setTimeout(() => {
          // This would need to be implemented to remove specific toast
        }, 100)
      }
    }
  }
}

// CSS for animations (to be added to globals.css)
export const toastStyles = `
  @keyframes toast-progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }

  .toast-enter {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }

  .toast-exit {
    opacity: 1;
    transform: translateX(0);
  }

  .toast-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 300ms, transform 300ms;
  }
`

export default Toast 