export type AmountInputCurrency = 'COP' | 'USD' | 'EUR'

export interface AmountInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  currency?: AmountInputCurrency
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  min?: number
  max?: number
  disabled?: boolean
  fullWidth?: boolean
  id?: string
}
