import type {
  BasicInfoFormValues,
  FinancialBaseFormValues,
  ProfileFormErrors,
} from '../types/profile.types.ts'

export function validateBasicInfo(
  values: BasicInfoFormValues,
): ProfileFormErrors<BasicInfoFormValues> {
  const errors: ProfileFormErrors<BasicInfoFormValues> = {}

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio'
  else if (values.name.trim().length < 3) errors.name = 'Mínimo 3 caracteres'

  if (!values.email.trim()) errors.email = 'El correo es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Correo inválido'

  if (values.phone && !/^[+\d\s\-()]{7,20}$/.test(values.phone)) {
    errors.phone = 'Teléfono inválido'
  }

  return errors
}

export function validateFinancialBase(
  values: FinancialBaseFormValues,
): ProfileFormErrors<FinancialBaseFormValues> {
  const errors: ProfileFormErrors<FinancialBaseFormValues> = {}

  if (!values.monthlyIncome || values.monthlyIncome <= 0) {
    errors.monthlyIncome = 'Ingresa un ingreso válido'
  }
  if (!values.occupation.trim()) errors.occupation = 'La ocupación es obligatoria'
  if (values.fixedExpenses < 0) errors.fixedExpenses = 'Los gastos no pueden ser negativos'

  return errors
}

export function formatLastEdited(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'ayer'
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
