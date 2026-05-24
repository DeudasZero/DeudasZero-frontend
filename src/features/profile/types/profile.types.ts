export type AccountStatus = 'active' | 'inactive' | 'suspended'
export type IncomeFrequency = 'monthly' | 'biweekly' | 'weekly'

export interface ProfileBasicInfo {
  name: string
  email: string
  phone: string
  city: string
}

export interface ProfileFinancialBase {
  monthlyIncome: number
  incomeFrequency: IncomeFrequency
  occupation: string
  fixedExpenses: number
}

export interface Profile {
  id: string
  accountStatus: AccountStatus
  lastEdited: string
  basic: ProfileBasicInfo
  financial: ProfileFinancialBase
}

export interface ProfileState {
  data: Profile | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  successMessage: string | null
}

export type BasicInfoFormValues = ProfileBasicInfo
export type FinancialBaseFormValues = ProfileFinancialBase

export type ProfileFormErrors<T> = Partial<Record<keyof T, string>>
