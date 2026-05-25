import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import {
  fetchTransactions,
  addTransaction,
  removeTransaction,
  clearMessages,
} from '../store/transactions.slice.ts'
import type { NewTransactionForm, Transaction } from '../types/transactions.types.ts'

export function useTransactions() {
  const dispatch = useAppDispatch()
  const { data, isLoading, isSaving, isDeleting, error, saveError, successMessage, deleteError } =
    useAppSelector((s) => s.transactions)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  async function save(form: NewTransactionForm) {
    await dispatch(addTransaction(form))
  }

  async function remove(tx: Pick<Transaction, 'id' | 'type'>) {
    await dispatch(removeTransaction(tx))
  }

  function dismiss() {
    dispatch(clearMessages())
  }

  return {
    data,
    isLoading,
    isSaving,
    isDeleting,
    error,
    saveError,
    successMessage,
    deleteError,
    save,
    remove,
    dismiss,
  }
}
