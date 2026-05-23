import { http } from '../../../services/http.ts'
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from '../types/auth.types.ts'

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>('/auth/login', credentials)

  return data
}

export const registerUser = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const { data } = await http.post<RegisterResponse>('/auth/register', credentials)

  return data
}
