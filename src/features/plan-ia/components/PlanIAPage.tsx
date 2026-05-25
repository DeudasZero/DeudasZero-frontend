import { useEffect, type FC } from 'react'
import { Alert } from '@/shared/components/molecules/alert/index.ts'
import { Button } from '@atoms/button/Button.tsx'
import { usePlanIA } from '../hooks/usePlanIA.ts'
import { PlanSummaryCard } from './PlanSummaryCard.tsx'
import { PlanSchedule } from './PlanSchedule.tsx'
import { AIAdvisorChat } from './AIAdvisorChat.tsx'
import type { PaymentStrategy } from '../types/plan-ia.types.ts'

const STRATEGY_LABEL: Record<PaymentStrategy, string> = {
  avalanche: 'Avalancha',
  snowball: 'Bola de Nieve',
}

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 3l1.5 5.5H19l-4.5 3.3 1.5 5.5L12 14l-4 3.3 1.5-5.5L5 8.5h5.5z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
)

const EmptyPlan: FC<{
  strategy: PaymentStrategy
  isGenerating: boolean
  onGenerate: (s: PaymentStrategy) => void
}> = ({ strategy, isGenerating, onGenerate }) => (
  <div
    className="flex flex-col items-center justify-center gap-5 rounded-[12px] p-10 text-center"
    style={{
      background: 'rgb(20,28,36)',
      border: '1px solid rgba(220,235,255,0.06)',
      minHeight: '320px',
    }}
  >
    <div style={{ color: 'var(--dz-signature)', opacity: 0.6 }}>
      <SparkleIcon />
    </div>
    <div className="flex flex-col gap-2">
      <p
        className="m-0 font-sans font-semibold"
        style={{ fontSize: '16px', color: 'var(--dz-text-primary)' }}
      >
        Aún no tienes un plan generado
      </p>
      <p
        className="m-0 font-sans"
        style={{ fontSize: '13px', color: 'var(--dz-text-muted)', maxWidth: '320px' }}
      >
        Genera tu plan de liquidación con la estrategia que prefieras. El consejero IA calculará el
        cronograma óptimo basado en tus deudas reales.
      </p>
    </div>

    <div className="flex gap-3 flex-wrap justify-center">
      {(['avalanche', 'snowball'] as PaymentStrategy[]).map((s) => (
        <Button
          key={s}
          variant={strategy === s ? 'primary' : 'ghost'}
          size="sm"
          disabled={isGenerating}
          onClick={() => onGenerate(s)}
        >
          {isGenerating && strategy === s ? 'Generando…' : `Plan ${STRATEGY_LABEL[s]}`}
        </Button>
      ))}
    </div>
  </div>
)

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
