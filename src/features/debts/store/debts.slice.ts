import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDebts } from '../services/debts.service.ts'
import type { DebtsState } from '../types/debts.types.ts'

const initialState: DebtsState = { data: null, isLoading: false, error: null }

export const fetchDebts = createAsyncThunk('debts/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getDebts()
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Error')
  }
})

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebts.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(fetchDebts.fulfilled, (s, a) => {
        s.isLoading = false
        s.data = a.payload
      })
      .addCase(fetchDebts.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })
  },
})

export default debtsSlice.reducer
