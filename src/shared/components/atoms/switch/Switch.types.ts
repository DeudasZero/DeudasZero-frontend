export type SwitchSize = 'sm' | 'md'

export interface SwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  hint?: string
  disabled?: boolean
  size?: SwitchSize
  id?: string
}
