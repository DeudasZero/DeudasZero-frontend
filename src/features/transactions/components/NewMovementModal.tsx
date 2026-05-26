import type { FC } from 'react'
import type { NewTransactionForm, TxType } from '../types/transactions.types.ts'
import { NewMovementModalContent } from './NewMovementModalContent.tsx'

interface NewMovementModalProps {
  open: boolean
  onClose: () => void
  onSave: (form: NewTransactionForm) => void
  isSaving?: boolean
  saveError?: string | null
  defaultType?: TxType
}

export const NewMovementModal: FC<NewMovementModalProps> = ({ open, ...props }) => {
  if (!open) return null
  return <NewMovementModalContent key={String(open)} {...props} />
}
