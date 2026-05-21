import type { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  actions?: ReactNode
  backAction?: { label: string; onClick: () => void }
  className?: string
}
