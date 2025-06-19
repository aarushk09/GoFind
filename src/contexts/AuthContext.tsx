'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { AuthState, User, LoginCredentials, SignUpCredentials } from '../types/auth'
import { Session } from '@supabase/supabase-js'

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
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Check if required environment variables are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Supabase configuration is missing. Please check your environment variables.' 
      }))
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setState(prev => ({ ...prev, loading: false, error: error.message }))
          return
        }

        setState(prev => ({
          ...prev,
          session: session ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token || '',
            expires_at: session.expires_at || 0,
            user: session.user as User
          } : null,
          user: session?.user as User || null,
          loading: false,
          error: null,
        }))
      } catch (error) {
        console.error('Unexpected error getting session:', error)
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load authentication state' 
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        setState(prev => ({
          ...prev,
          session: session ? {
            access_token: session.access_token,
            refresh_token: session.refresh_token || '',
            expires_at: session.expires_at || 0,
            user: session.user as User
          } : null,
          user: session?.user as User || null,
          loading: false,
          error: null,
        }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error: error.message }
      }

      // State will be updated automatically via onAuthStateChange
      setState(prev => ({ ...prev, loading: false }))
      return {}
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign in'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: 'host', // Default role for new signups
          },
        },
      })

      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return { error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return {}
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during sign up'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return
      }

      // Clear local state
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to sign out' 
      }))
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
    } catch (error) {
      return { error: 'An unexpected error occurred while resetting password' }
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
