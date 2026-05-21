import type { ElementType } from 'react'
import type { DZWeight } from '../tokens/types.ts'

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'eyebrow' | 'mono'

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'faint'
  | 'signature'
  | 'income'
  | 'expense'
  | 'saving'
  | 'debt'

export interface TextProps {
  variant?: TextVariant
  color?: TextColor
  weight?: DZWeight
  as?: ElementType
  truncate?: boolean
  tabularNums?: boolean
  children: React.ReactNode
  className?: string
}
