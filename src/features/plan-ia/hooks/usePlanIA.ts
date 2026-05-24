import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hookStore.ts'
import { fetchPlanIA, setStrategy, addMessage } from '../store/plan-ia.slice.ts'
import { buildSchedule, calcPlanSummary } from '../utils/plan.utils.ts'
import { generateAIReply, makeUserMessage, makeAIMessage } from '../utils/chat.utils.ts'
import { MOCK_PLAN_DEBTS } from '../services/plan-ia.mock.ts'
import type { PaymentStrategy } from '../types/plan-ia.types.ts'

export function usePlanIA() {
  const dispatch = useAppDispatch()
  const { strategy, monthlyBudget, messages, isLoading, error } = useAppSelector((s) => s.planIA)

  useEffect(() => {
    dispatch(fetchPlanIA())
  }, [dispatch])

  const summary = calcPlanSummary(MOCK_PLAN_DEBTS, strategy, monthlyBudget, 2)
  const schedule = buildSchedule(MOCK_PLAN_DEBTS, strategy, monthlyBudget, 2)

  function changeStrategy(s: PaymentStrategy) {
    dispatch(setStrategy(s))
  }

  function sendChatMessage(text: string) {
    if (!text.trim()) return
    dispatch(addMessage(makeUserMessage(text)))
    setTimeout(
      () => {
        const { content, tag } = generateAIReply(text)
        dispatch(addMessage(makeAIMessage(content, tag)))
      },
      1100 + Math.random() * 600,
    )
  }

  return {
    strategy,
    monthlyBudget,
    messages,
    isLoading,
    error,
    summary,
    schedule,
    changeStrategy,
    sendChatMessage,
  }
}
