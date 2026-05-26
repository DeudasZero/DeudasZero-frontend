import { useEffect, type FC } from 'react'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import { usePlanIA } from '../hooks/usePlanIA.ts'
import { PlanSummaryCard } from './PlanSummaryCard.tsx'
import { PlanSchedule } from './PlanSchedule.tsx'
import { AIAdvisorChat } from './AIAdvisorChat.tsx'
import { EmptyPlan } from './EmptyPlan.tsx'

export const PlanIAPage: FC = () => {
  const {
    strategy,
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
  } = usePlanIA()

  useEffect(() => {
    if (!successMessage && !planError && !chatError) return
    const timer = setTimeout(dismiss, 4000)
    return () => clearTimeout(timer)
  }, [successMessage, planError, chatError, dismiss])

  return (
    <div className="flex flex-col gap-4">
      {successMessage && (
        <Alert variant="success" onDismiss={dismiss}>
          {successMessage}
        </Alert>
      )}
      {(planError ?? chatError) && (
        <Alert variant="danger" onDismiss={dismiss}>
          {planError ?? chatError}
        </Alert>
      )}

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {summary ? (
            <>
              <PlanSummaryCard
                summary={summary}
                isLoading={isLoadingPlan}
                strategy={strategy}
                onStrategyChange={(s) => {
                  changeStrategy(s)
                  void generate(s)
                }}
                isGenerating={isGenerating}
              />
              <PlanSchedule
                rows={schedule}
                historyRows={historyRows}
                isLoading={isLoadingPlan}
                isLoadingHistory={isLoadingHistory}
                isMarkingPaid={isMarkingPaid}
                onMarkPaid={markPaid}
              />
            </>
          ) : (
            <EmptyPlan
              strategy={strategy}
              isGenerating={isGenerating || isLoadingPlan}
              onGenerate={generate}
            />
          )}
        </div>

        <AIAdvisorChat
          messages={messages}
          onSend={sendChat}
          isTyping={isSendingChat}
          onReset={resetChatHistory}
        />
      </div>
    </div>
  )
}
