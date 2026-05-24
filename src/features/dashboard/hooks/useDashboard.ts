import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import { fetchDashboard } from '../store/dashboard.slice.ts'

export function useDashboard() {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector((state) => state.dashboard)
  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])
  return { data, isLoading, error }
}
