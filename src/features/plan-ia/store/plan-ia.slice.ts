import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getPlanIA } from '../services/plan-ia.service.ts'
import { buildInitialMessages } from '../utils/chat.utils.ts'
import type { PlanIAState, PaymentStrategy, ChatMessage } from '../types/plan-ia.types.ts'

const initialState: PlanIAState = {
  strategy: 'avalanche',
  monthlyBudget: 715_000,
  messages: buildInitialMessages(),
  isLoading: false,
  error: null,
}

export const fetchPlanIA = createAsyncThunk('planIA/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getPlanIA()
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Error')
  }
})

const planIASlice = createSlice({
  name: 'planIA',
  initialState,
  reducers: {
    setStrategy(state, action: PayloadAction<PaymentStrategy>) {
      state.strategy = action.payload
    },
    setMonthlyBudget(state, action: PayloadAction<number>) {
      state.monthlyBudget = action.payload
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanIA.pending, (s) => {
        s.isLoading = true
        s.error = null
      })
      .addCase(fetchPlanIA.fulfilled, (s, a) => {
        s.isLoading = false
        s.monthlyBudget = a.payload.monthlyBudget
      })
      .addCase(fetchPlanIA.rejected, (s, a) => {
        s.isLoading = false
        s.error = a.payload as string
      })
  },
})

export const { setStrategy, setMonthlyBudget, addMessage } = planIASlice.actions
export default planIASlice.reducer
