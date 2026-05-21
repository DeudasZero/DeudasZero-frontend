export interface DebtFormValues {
  name: string
  creditor: string
  totalDebt: string | number
  balance: string | number
  interestRate: string | number
  minPayment: string | number
  nextPaymentDate: string
  currency: 'COP' | 'USD' | 'EUR'
  notes: string
}

export type DebtFormErrors = Partial<Record<keyof DebtFormValues, string>>

export interface DebtFormProps {
  initialValues?: Partial<DebtFormValues>
  onSubmit: (values: DebtFormValues) => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  mode?: 'create' | 'edit'
  className?: string
}
