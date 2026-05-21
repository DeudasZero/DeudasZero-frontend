import type { ReactNode } from 'react'

export interface DataListEntry {
  label: string
  value: ReactNode
  accent?: boolean
}

export interface DataListProps {
  entries: DataListEntry[]
  layout?: 'vertical' | 'horizontal'
  className?: string
}
