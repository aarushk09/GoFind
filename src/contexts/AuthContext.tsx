'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  created_at: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignUpCredentials extends LoginCredentials {
  name?: string
}

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<{ error?: string }>
  signUp: (credentials: SignUpCredentials) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing auth...')
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          if (mounted) {
            setError(error.message)
            setLoading(false)
          }
          return
        }

        console.log('📋 Initial session check:', initialSession ? '✅ Found' : '❌ Not found')
        
        if (mounted && initialSession) {
          const userData = initialSession.user as User
          console.log('👤 Setting user:', userData.email)
          setUser(userData)
          setSession(initialSession)
        }
        
        if (mounted) {
          setLoading(false)
          setError(null)
        }

      } catch (err) {
        console.error('💥 Unexpected error during auth init:', err)
        if (mounted) {
          setError('Failed to initialize authentication')
          setLoading(false)
        }
      }
    }

    // Initialize auth
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('🔄 Auth state changed:', event)
        
        if (!mounted) return

        if (newSession) {
          const userData = newSession.user as User
          console.log('✅ User authenticated:', userData.email)
          setUser(userData)
          setSession(newSession)
        } else {
          console.log('❌ User signed out')
          setUser(null)
          setSession(null)
        }
        
        setLoading(false)
        setError(null)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔑 Attempting sign in for:', credentials.email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        console.error('❌ Sign in failed:', error.message)
        setError(error.message)
        setLoading(false)
        return { error: error.message }
      }

      console.log('✅ Sign in successful')
      // Auth state will be updated by the listener
      return {}
    } catch (err) {
      console.error('💥 Unexpected sign in error:', err)
      const errorMessage = 'An unexpected error occurred during sign in'
      setError(errorMessage)
      setLoading(false)
      return { error: errorMessage }
    }
  }

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('📝 Attempting sign up for:', credentials.email)
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: 'host',
          },
        },
      })

      if (error) {
        console.error('❌ Sign up failed:', error.message)
        setError(error.message)
        setLoading(false)
        return { error: error.message }
      }

      console.log('✅ Sign up successful')
      setLoading(false)
      return {}
    } catch (err) {
      console.error('💥 Unexpected sign up error:', err)
      const errorMessage = 'An unexpected error occurred during sign up'
      setError(errorMessage)
      setLoading(false)
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('🚪 Signing out...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Sign out failed:', error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('✅ Sign out successful')
      // Auth state will be updated by the listener
    } catch (err) {
      console.error('💥 Unexpected sign out error:', err)
      setError('Failed to sign out')
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (err) {
      return { error: 'An unexpected error occurred while resetting password' }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

















