import type { ReactNode } from 'react'

export interface TopBarAction {
  id: string
  label: string
  icon?: ReactNode
  badge?: number
  onClick?: () => void
}

export interface TopBarProps {
  title?: string
  subtitle?: string
  eyebrow?: string
  actions?: TopBarAction[]
  onMenuToggle?: () => void
  showMenuButton?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode
  className?: string
}
