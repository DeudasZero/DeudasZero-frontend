import { http } from '../../../services/http.ts'
import type { LoginCredentials, LoginResponse } from '../types/auth.types.ts'

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>('/auth/login', credentials)

  return data
}
