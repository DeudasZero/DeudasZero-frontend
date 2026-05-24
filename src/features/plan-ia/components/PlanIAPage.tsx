import { useState, type FC } from 'react'
import { usePlanIA } from '../hooks/usePlanIA.ts'
import { PlanSummaryCard } from './PlanSummaryCard.tsx'
import { PlanSchedule } from './PlanSchedule.tsx'
import { AIAdvisorChat } from './AIAdvisorChat.tsx'

export const PlanIAPage: FC = () => {
  const { summary, schedule, messages, isLoading, changeStrategy, sendChatMessage } = usePlanIA()
  const [isTyping, setIsTyping] = useState(false)

  function handleSend(text: string) {
    setIsTyping(true)
    sendChatMessage(text)
    setTimeout(() => setIsTyping(false), 1100 + Math.random() * 600 + 50)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      {/* Left: Plan panel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <PlanSummaryCard
          summary={summary}
          isLoading={isLoading}
          onStrategyChange={changeStrategy}
        />
        <PlanSchedule rows={schedule} isLoading={isLoading} />
      </div>

      {/* Right: AI chat */}
      <AIAdvisorChat messages={messages} onSend={handleSend} isTyping={isTyping} />
    </div>
  )
}
