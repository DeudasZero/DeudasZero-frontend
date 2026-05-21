import type { ReactNode } from 'react'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'ghost'
}

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}
