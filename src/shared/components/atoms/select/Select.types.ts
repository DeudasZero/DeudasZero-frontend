export type SelectSize = 'sm' | 'md'

export interface SelectOption<V = string> {
  value: V
  label: string
  disabled?: boolean
}

export interface SelectProps<V = string> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption<V>[]
  value?: V
  onChange?: (value: V) => void
  placeholder?: string
  fullWidth?: boolean
  disabled?: boolean
  size?: SelectSize
  className?: string
}
