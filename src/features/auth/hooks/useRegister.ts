import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@store/hookStore.ts'
import { register, clearError } from '../store/auth.slice.ts'
import { selectAuthLoading, selectAuthError } from '../store/auth.slice.ts'
import type { RegisterCredentials } from '../types/auth.types.ts'

export const useRegister = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  const handleRegister = async (credentials: RegisterCredentials) => {
    const result = await dispatch(register(credentials))
    if (register.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  const dismissError = () => dispatch(clearError())

  return {
    isLoading,
    error,
    handleRegister,
    dismissError,
  }
}
