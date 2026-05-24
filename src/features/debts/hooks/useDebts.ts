import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import { fetchDebts } from '../store/debts.slice.ts'

export function useDebts() {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector((s) => s.debts)
  useEffect(() => {
    dispatch(fetchDebts())
  }, [dispatch])
  return { data, isLoading, error }
}
