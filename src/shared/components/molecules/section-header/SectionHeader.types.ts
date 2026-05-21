import type { ReactNode } from 'react'

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  divider?: boolean
  className?: string
}
