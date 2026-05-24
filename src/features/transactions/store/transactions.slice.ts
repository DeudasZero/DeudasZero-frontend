import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getTransactions } from '../services/transactions.service.ts'
import type { TransactionsState } from '../types/transactions.types.ts'

const initialState: TransactionsState = { data: null, isLoading: false, error: null }

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getTransactions()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Error')
    }
  },
)

const slice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(fetchTransactions.fulfilled, (s, a) => {
        s.isLoading = false
        s.data = a.payload
      })
      .addCase(fetchTransactions.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })
  },
})

export default slice.reducer
