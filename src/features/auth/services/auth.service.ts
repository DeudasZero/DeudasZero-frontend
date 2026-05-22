import axios from 'axios'
import type { LoginCredentials, LoginResponse } from '../types/auth.types.ts'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  },
)

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await authApi.post<LoginResponse>('/auth/login', credentials)
  return data
}

export default authApi
