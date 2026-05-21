import type { ReactNode } from 'react'

export interface NavItemProps {
  label: string
  icon?: ReactNode
  href?: string
  active?: boolean
  badge?: number
  onClick?: () => void
  className?: string
}
