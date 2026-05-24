import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/store/auth.slice.ts'
import dashboardReducer from '@/features/dashboard/store/dashboard.slice.ts'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
