export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  id?: string
  className?: string
}
