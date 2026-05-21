import type { ReactNode } from 'react'

export type CardPadding = 'sm' | 'md' | 'lg'
export type CardSurface = 'surface' | 'raised' | 'sunken'

export interface CardProps {
  children: ReactNode
  padding?: CardPadding
  surface?: CardSurface
  noBorder?: boolean
  onClick?: () => void
  className?: string
}
