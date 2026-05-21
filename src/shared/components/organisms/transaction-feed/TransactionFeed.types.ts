export type TransactionFeedFilter = 'all' | 'income' | 'expense' | 'saving' | 'debt'

export interface TransactionFeedItem {
  id: string
  title: string
  amount: number
  date: string
  type: 'income' | 'expense' | 'saving' | 'debt'
  currency?: string
  locale?: string
  icon?: string
  category?: string
  note?: string
}

export interface TransactionFeedGroup {
  label: string
  items: TransactionFeedItem[]
}

export interface TransactionFeedProps {
  transactions: TransactionFeedItem[]
  filter?: TransactionFeedFilter
  onFilterChange?: (filter: TransactionFeedFilter) => void
  groupBy?: 'date' | 'none'
  onTransactionClick?: (item: TransactionFeedItem) => void
  onAddTransaction?: () => void
  loading?: boolean
  maxItems?: number
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}
