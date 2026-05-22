export interface LoginCredentials {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthUser {
  id: string
  email: string
  name: string
  token: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface ApiError {
  message: string
  statusCode: number
}
