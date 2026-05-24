import type { PlanDebt } from '../types/plan-ia.types.ts'

export const MOCK_PLAN_DEBTS: PlanDebt[] = [
  {
    id: 'd1',
    name: 'Visa Bancolombia',
    creditor: 'BANCOLOMBIA',
    balance: 1_462_000,
    interestRate: 3.1,
    minPayment: 565_000,
    color: '#f0b57a',
  },
  {
    id: 'd2',
    name: 'Tarjeta Falabella',
    creditor: 'FALABELLA',
    balance: 2_800_000,
    interestRate: 2.4,
    minPayment: 540_000,
    color: '#e07a9c',
  },
  {
    id: 'd3',
    name: 'Crédito Davivienda',
    creditor: 'DAVIVIENDA',
    balance: 5_400_000,
    interestRate: 1.8,
    minPayment: 880_000,
    color: '#8fa8f0',
  },
]

export const MOCK_MONTHLY_BUDGET = 715_000
