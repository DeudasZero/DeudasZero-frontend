import type { ReactNode } from 'react'

export interface ListItemProps {
  title: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}
