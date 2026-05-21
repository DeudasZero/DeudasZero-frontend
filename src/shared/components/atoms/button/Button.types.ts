import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { DZVariant } from '../tokens/types.ts'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type { DZVariant as ButtonVariant } from '../tokens/types.ts'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DZVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  iconOnly?: boolean
  fullWidth?: boolean
  loading?: boolean
}
