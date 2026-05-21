import type { ReactNode } from 'react'

export interface TabItem {
  value: string
  label: string
  badge?: number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (value: string) => void
  children?: ReactNode
  className?: string
}
