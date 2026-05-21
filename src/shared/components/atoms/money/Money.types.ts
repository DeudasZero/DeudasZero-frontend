import type { DZAccent } from '../tokens/types.ts'

export type MoneyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption'

export interface MoneyProps {
  amount: number
  currency?: string
  locale?: string
  variant?: MoneyVariant
  showSign?: boolean
  dimCents?: boolean
  accent?: DZAccent
  className?: string
}
