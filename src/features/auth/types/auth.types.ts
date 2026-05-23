export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
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

export interface RegisterResponse {
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
