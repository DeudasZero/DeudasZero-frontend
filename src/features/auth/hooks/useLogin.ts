import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../store/hookStore.ts'
import { login, clearError } from '../store/auth.slice.ts'
import { selectAuthLoading, selectAuthError } from '../store/auth.slice.ts'
import type { LoginCredentials } from '../types/auth.types.ts'

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await dispatch(login(credentials))
    if (login.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const dismissError = () => dispatch(clearError())

  return {
    isLoading,
    error,
    showPassword,
    handleLogin,
    togglePasswordVisibility,
    dismissError,
  }
}
