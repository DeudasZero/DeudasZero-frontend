import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import {
  fetchActivePlan,
  createPlan,
  markInstallmentPaid,
  loadAiReport,
  sendMessage,
  setStrategy,
  clearMessages,
  resetChat,
  fetchPlanHistory,
} from '../store/plan-ia.slice.ts'
import type {
  PaymentStrategy,
  ScheduleRow,
  ScheduleRowStatus,
  PlanSummary,
  InstallmentResponseDTO,
  HistoryRow,
  PlanHistoryResponseDTO,
} from '../types/plan-ia.types.ts'
import { STRATEGY_TO_API } from '../types/plan-ia.types.ts'

function formatMonthLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return d
    .toLocaleString('es-CO', { month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace('.', '')
}

function formatDueDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  const day = d.getDate()
  const mon = d.toLocaleString('es-CO', { month: 'short' }).replace('.', '').toUpperCase()
  return `${day} ${mon}`
}

function installmentToRow(inst: InstallmentResponseDTO, paidInstallments: number): ScheduleRow {
  let status: ScheduleRowStatus = 'pending'
  if (inst.paid) {
    status = 'paid'
  } else if (inst.monthNumber === paidInstallments + 1) {
    status = 'current'
  }

  return {
    installmentId: inst.id,
    debtId: inst.debtId,
    debtName: inst.debtName,
    month: inst.monthNumber,
    date: formatMonthLabel(inst.dueDate),
    dueDate: formatDueDate(inst.dueDate),
    totalPayment: inst.paymentAmount + inst.extraPayment,
    extraPayment: inst.extraPayment,
    status,
  }
}

function buildPlanSummary(plan: import('../types/plan-ia.types.ts').PlanResponseDTO): PlanSummary {
  const firstInst = plan.installments[0]
  const lastInst = plan.installments[plan.installments.length - 1]

  return {
    planId: plan.id,
    strategy: plan.strategy === 'AVALANCHE' ? 'avalanche' : 'snowball',
    aiSummary: plan.aiSummary,
    interestSaved: plan.interestSaved,
    monthsToPayoff: plan.monthsToPayoff,
    paidInstallments: plan.paidInstallments,
    totalInstallments: plan.totalInstallments,
    startLabel: firstInst ? formatMonthLabel(firstInst.dueDate) : '—',
    endLabel: lastInst ? formatMonthLabel(lastInst.dueDate) : '—',
  }
}

function planToHistoryRow(plan: PlanHistoryResponseDTO): HistoryRow {
  return {
    planId: plan.id,
    strategy: plan.strategy === 'AVALANCHE' ? 'avalanche' : 'snowball',
    createdAt: formatMonthLabel(plan.createdAt.split('T')[0] ?? plan.createdAt),
    monthsToPayoff: plan.monthsToPayoff,
    totalInstallments: plan.totalInstallments,
    interestSaved: plan.interestSaved,
    active: plan.active,
  }
}

export function usePlanIA() {
  const dispatch = useAppDispatch()
  const {
    strategy,
    plan,
    history,
    messages,
    isLoadingPlan,
    isLoadingHistory,
    isGenerating,
    isSendingChat,
    isMarkingPaid,
    planError,
    chatError,
    successMessage,
  } = useAppSelector((s) => s.planIA)

  useEffect(() => {
    dispatch(fetchActivePlan())
    dispatch(loadAiReport())
    dispatch(fetchPlanHistory())
  }, [dispatch])

  const summary = useMemo<PlanSummary | null>(() => (plan ? buildPlanSummary(plan) : null), [plan])

  const schedule = useMemo<ScheduleRow[]>(
    () =>
      plan ? plan.installments.map((inst) => installmentToRow(inst, plan.paidInstallments)) : [],
    [plan],
  )

  const historyRows = useMemo<HistoryRow[]>(() => history.map(planToHistoryRow), [history])

  function changeStrategy(s: PaymentStrategy) {
    dispatch(setStrategy(s))
  }

  async function generate(s?: PaymentStrategy) {
    const target = s ?? strategy
    dispatch(setStrategy(target))
    await dispatch(createPlan(STRATEGY_TO_API[target]))
  }

  async function markPaid(installmentId: string) {
    await dispatch(markInstallmentPaid(installmentId))
  }

  async function sendChat(text: string) {
    if (!text.trim() || isSendingChat) return
    await dispatch(sendMessage(text.trim()))
  }

  function dismiss() {
    dispatch(clearMessages())
  }

  function resetChatHistory() {
    dispatch(resetChat())
    dispatch(loadAiReport())
  }

  return {
    strategy,
    plan,
    summary,
    schedule,
    historyRows,
    messages,
    isLoadingPlan,
    isLoadingHistory,
    isGenerating,
    isSendingChat,
    isMarkingPaid,
    planError,
    chatError,
    successMessage,
    changeStrategy,
    generate,
    markPaid,
    sendChat,
    dismiss,
    resetChatHistory,
  }
}
