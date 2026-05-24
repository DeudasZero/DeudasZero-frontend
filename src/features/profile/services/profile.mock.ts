import type { Profile } from '../types/profile.types.ts'

export const MOCK_PROFILE: Profile = {
  id: 'usr_001',
  accountStatus: 'active',
  lastEdited: new Date().toISOString(),
  basic: {
    name: 'Mariana López',
    email: 'mariana@deudazero.com',
    phone: '+57 312 555 0142',
    city: 'Bogotá',
  },
  financial: {
    monthlyIncome: 4_500_000,
    incomeFrequency: 'monthly',
    occupation: 'Diseñadora UX',
    fixedExpenses: 1_800_000,
  },
}
