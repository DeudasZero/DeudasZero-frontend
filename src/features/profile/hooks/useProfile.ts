import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import {
  fetchProfile,
  saveBasicInfo,
  saveFinancialBase,
  clearMessages,
} from '../store/profile.slice.ts'
import type { BasicInfoFormValues, FinancialBaseFormValues } from '../types/profile.types.ts'

export function useProfile() {
  const dispatch = useAppDispatch()
  const { data, isLoading, isSaving, error, successMessage } = useAppSelector((s) => s.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  function handleSaveBasic(values: BasicInfoFormValues) {
    dispatch(saveBasicInfo(values))
  }

  function handleSaveFinancial(values: FinancialBaseFormValues) {
    dispatch(saveFinancialBase(values))
  }

  function handleClearMessages() {
    dispatch(clearMessages())
  }

  return {
    profile: data,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveBasicInfo: handleSaveBasic,
    saveFinancialBase: handleSaveFinancial,
    clearMessages: handleClearMessages,
  }
}
