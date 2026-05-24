import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/store/auth.slice.ts'
import dashboardReducer from '@/features/dashboard/store/dashboard.slice.ts'
import transactionsReducer from '@/features/transactions/store/transactions.slice.ts'
import debtsReducer from '@/features/debts/store/debts.slice.ts'
import planIAReducer from '@/features/plan-ia/store/plan-ia.slice.ts'
import profileReducer from '@/features/profile/store/profile.slice.ts'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    transactions: transactionsReducer,
    debts: debtsReducer,
    planIA: planIAReducer,
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
