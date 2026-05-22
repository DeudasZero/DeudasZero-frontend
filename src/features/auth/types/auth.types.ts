export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthUser {
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  name: string
  email: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
