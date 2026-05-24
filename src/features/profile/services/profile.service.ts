import { http } from '@/services/http.ts'
import { MOCK_PROFILE } from './profile.mock.ts'
import type {
  Profile,
  BasicInfoFormValues,
  FinancialBaseFormValues,
} from '../types/profile.types.ts'

export async function getProfile(): Promise<Profile> {
  try {
    const res = await http.get<Profile>('/profile')
    return res.data
  } catch {
    return MOCK_PROFILE
  }
}

export async function updateBasicInfo(values: BasicInfoFormValues): Promise<Profile> {
  try {
    const res = await http.patch<Profile>('/profile/basic', values)
    return res.data
  } catch {
    // Mock optimistic update
    return { ...MOCK_PROFILE, basic: values, lastEdited: new Date().toISOString() }
  }
}

export async function updateFinancialBase(values: FinancialBaseFormValues): Promise<Profile> {
  try {
    const res = await http.patch<Profile>('/profile/financial', values)
    return res.data
  } catch {
    return { ...MOCK_PROFILE, financial: values, lastEdited: new Date().toISOString() }
  }
}
