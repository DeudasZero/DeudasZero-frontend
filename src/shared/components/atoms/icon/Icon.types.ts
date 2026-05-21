import type { ReactNode } from 'react'
import type { TextColor } from '../text/Text.types.ts'

export interface IconProps {
  children: ReactNode
  size?: number | string
  color?: TextColor | 'inherit'
  label?: string
  className?: string
}
