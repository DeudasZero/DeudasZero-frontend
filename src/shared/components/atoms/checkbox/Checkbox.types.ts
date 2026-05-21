export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
  name?: string
}
