// Authentication types
export interface User {
  id: string
  email: string
  created_at: string
  user_metadata?: {
    name?: string
    role?: string
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  name?: string
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
  error: string | null
}
