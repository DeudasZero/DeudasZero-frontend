import type { ReactNode } from 'react'

export type ConfirmModalVariant = 'danger' | 'warning' | 'info'

export interface ConfirmModalProps {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmModalVariant
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}
