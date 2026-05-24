import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDashboardData } from '../services/dashboard.service.ts'
import type { DashboardState } from '../types/dashboard.types.ts'

const initialState: DashboardState = { data: null, isLoading: false, error: null }

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getDashboardData()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error')
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default dashboardSlice.reducer
