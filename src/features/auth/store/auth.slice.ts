import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loginUser, registerUser } from '../services/auth.service.ts'
import type {
  AuthState,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types.ts'
import type { RootState } from '../../../store/rootReducer.ts'

const USER_KEY = 'dz_user'

function persistUser(user: AuthUser, storage: Storage): void {
  try {
    storage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // quota exceeded – silently ignore
  }
}

function clearUser(): void {
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
}

function readPersistedUser(): AuthUser | null {
  try {
    const hasLocal = Boolean(localStorage.getItem('token'))
    const hasSession = Boolean(sessionStorage.getItem('token'))

    if (hasLocal) {
      const raw = localStorage.getItem(USER_KEY)
      if (raw) return JSON.parse(raw) as AuthUser
    }

    if (hasSession) {
      const raw = sessionStorage.getItem(USER_KEY)
      if (raw) return JSON.parse(raw) as AuthUser
    }
  } catch {
    // malformed JSON – treat as logged-out
  }
  return null
}

const persistedUser = readPersistedUser()

const initialState: AuthState = {
  user: persistedUser,
  isAuthenticated: persistedUser !== null,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials)
      const storage = credentials.rememberMe ? localStorage : sessionStorage

      storage.setItem('token', response.token)

      const user: AuthUser = { name: response.name, email: response.email }
      persistUser(user, storage)

      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      return rejectWithValue(message)
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await registerUser(credentials)

      localStorage.setItem('token', response.token)

      const user: AuthUser = { name: response.name, email: response.email }
      persistUser(user, localStorage)

      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la cuenta'
      return rejectWithValue(message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      clearUser()
    },
    clearError(state) {
      state.error = null
    },
    restoreSession(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, restoreSession } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error

export default authSlice.reducer
