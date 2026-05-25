import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import {
  fetchDebts,
  addDebt,
  editDebt,
  payDebt,
  removeDebt,
  clearMessages,
} from '../store/debts.slice.ts'
import type { DebtFormValues } from '../types/debts.types.ts'

export function useDebts() {
  const dispatch = useAppDispatch()
  const { data, isLoading, isSaving, isPatching, isDeleting, error, saveError, successMessage } =
    useAppSelector((s) => s.debts)

  useEffect(() => {
    dispatch(fetchDebts())
  }, [dispatch])

  async function save(values: DebtFormValues) {
    await dispatch(addDebt(values))
  }

  async function update(id: string, values: DebtFormValues) {
    await dispatch(editDebt({ id, values }))
  }

  async function pay(id: string) {
    await dispatch(payDebt(id))
  }

  async function remove(id: string) {
    await dispatch(removeDebt(id))
  }

  function dismiss() {
    dispatch(clearMessages())
  }

  return {
    data,
    isLoading,
    isSaving,
    isPatching,
    isDeleting,
    error,
    saveError,
    successMessage,
    save,
    update,
    pay,
    remove,
    dismiss,
  }
}
