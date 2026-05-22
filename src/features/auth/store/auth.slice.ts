import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loginUser } from '../services/auth.service.ts'
import type { AuthState, AuthUser, LoginCredentials } from '../types/auth.types.ts'
import type { RootState } from '../../../store/rootReducer.ts'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials)
      if (credentials.rememberMe) {
        localStorage.setItem('token', response.token)
      } else {
        sessionStorage.setItem('token', response.token)
      }
      return response.user
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
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
  },
})

export const { logout, clearError, restoreSession } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectAuthLoading = (state: RootState) => state.auth.isLoading
export const selectAuthError = (state: RootState) => state.auth.error

export default authSlice.reducer
