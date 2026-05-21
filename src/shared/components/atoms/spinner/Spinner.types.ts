import type { TextColor } from '../text/Text.types.ts'

export type SpinnerSize = 'sm' | 'md' | 'lg'
export type SpinnerColor = TextColor | 'signature'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  label?: string
  className?: string
}
