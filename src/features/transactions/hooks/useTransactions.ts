import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import { fetchTransactions } from '../store/transactions.slice.ts'

export function useTransactions() {
  const dispatch = useAppDispatch()
  const { data, isLoading, error } = useAppSelector((s) => s.transactions)
  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])
  return { data, isLoading, error }
}
