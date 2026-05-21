import type { ReactNode } from 'react'
import type { DZAccent } from '../tokens/types.ts'

export type BadgeSize = 'xs' | 'sm'

export interface BadgeProps {
  accent?: DZAccent
  size?: BadgeSize
  dot?: boolean
  children: ReactNode
  className?: string
}
