import type { CSSProperties, FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { OnboardingWizardProps, WizardStep } from './OnboardingWizard.types.ts'

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M2.5 7l3 3L11.5 4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const OnboardingWizard: FC<OnboardingWizardProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  onComplete,
  onSkip,
  completionLoading = false,
  completionLabel = 'Comenzar',
  className,
}) => {
  const { isNarrow, isCompact } = useBreakpoint()

  const currentStep = steps[currentStepIndex]
  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === steps.length - 1
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  if (!currentStep) return null

  function handleNext() {
    if (isLast) onComplete()
    else onStepChange(currentStepIndex + 1)
  }

  function handleBack() {
    if (!isFirst) onStepChange(currentStepIndex - 1)
  }

  const hPad = isNarrow ? '16px' : isCompact ? '24px' : '32px'

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: isNarrow ? 'var(--dz-r-lg)' : 'var(--dz-r-xl)',
        overflow: 'hidden',
        maxWidth: '640px',
        width: '100%',
      }}
    >
      <div
        style={{
          padding: `${isNarrow ? '16px' : '24px'} ${hPad} ${isNarrow ? '14px' : '20px'}`,
          borderBottom: '1px solid var(--dz-border-soft)',
          display: 'flex',
          flexDirection: 'column',
          gap: isNarrow ? '12px' : '16px',
        }}
      >
        {isNarrow ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {steps.map((_, i) => {
              const isDone = i < currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <span
                  key={i}
                  style={{
                    width: isCurrent ? '20px' : '8px',
                    height: '8px',
                    borderRadius: 'var(--dz-r-pill)',
                    background:
                      isDone || isCurrent ? 'var(--dz-signature)' : 'var(--dz-border-strong)',
                    opacity: isDone ? 0.5 : 1,
                    transition: 'all var(--dz-transition-base)',
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
        ) : (
          <div
            role="list"
            aria-label="Pasos del proceso"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {steps.map((step: WizardStep, i: number) => {
              const isDone = i < currentStepIndex
              const isCurrent = i === currentStepIndex
              const isReachable = i <= currentStepIndex

              const dotStyle: CSSProperties = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: `1.5px solid ${isDone || isCurrent ? 'var(--dz-signature)' : 'var(--dz-border-strong)'}`,
                background: isDone
                  ? 'var(--dz-signature)'
                  : isCurrent
                    ? 'var(--dz-tint-signature)'
                    : 'transparent',
                fontFamily: 'var(--dz-font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: isDone
                  ? 'var(--dz-bg-page)'
                  : isCurrent
                    ? 'var(--dz-signature)'
                    : 'var(--dz-text-faint)',
                cursor: isReachable ? 'pointer' : 'default',
                transition: 'all var(--dz-transition-fast)',
                flexShrink: 0,
              }

              return (
                <div
                  key={step.id}
                  role="listitem"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <button
                    type="button"
                    style={dotStyle}
                    disabled={!isReachable}
                    aria-label={`Paso ${i + 1}: ${step.title}${isDone ? ' (completado)' : isCurrent ? ' (actual)' : ''}`}
                    onClick={() => isReachable && onStepChange(i)}
                  >
                    {isDone ? <CheckIcon /> : i + 1}
                  </button>

                  {i < steps.length - 1 && (
                    <div
                      aria-hidden
                      style={{
                        flex: 1,
                        height: '1.5px',
                        background: isDone ? 'var(--dz-signature)' : 'var(--dz-border-base)',
                        minWidth: '16px',
                        transition: 'background var(--dz-transition-slow)',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <ProgressBar value={progress} accent="signature" size="xs" />

        {/* Step info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--dz-font-mono)',
                fontSize: 'var(--dz-fs-eyebrow)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 'var(--dz-ls-eyebrow)',
                color: 'var(--dz-signature)',
              }}
            >
              Paso {currentStepIndex + 1} de {steps.length}
            </span>
            {currentStep.isOptional && (
              <span
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: '10px',
                  color: 'var(--dz-text-faint)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                · Opcional
              </span>
            )}
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: isNarrow ? 'var(--dz-fs-h3)' : 'var(--dz-fs-h2)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            {currentStep.title}
          </h2>

          {currentStep.description && (
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-body)',
                color: 'var(--dz-text-secondary)',
                lineHeight: 'var(--dz-lh-body)',
                letterSpacing: 'var(--dz-ls-normal)',
              }}
            >
              {currentStep.description}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          padding: `${isNarrow ? '20px' : '28px'} ${hPad}`,
          flex: 1,
        }}
      >
        {currentStep.content}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `14px ${hPad} ${isNarrow ? '16px' : '24px'}`,
          borderTop: '1px solid var(--dz-border-soft)',
          gap: '10px',
          flexWrap: isNarrow ? 'wrap' : undefined,
        }}
      >
        <div>
          {onSkip && currentStep.isOptional && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Omitir
            </Button>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            flex: isNarrow ? 1 : undefined,
            justifyContent: isNarrow ? 'flex-end' : undefined,
          }}
        >
          {!isFirst && (
            <Button variant="secondary" size={isNarrow ? 'sm' : 'md'} onClick={handleBack}>
              Atrás
            </Button>
          )}
          <Button
            variant="primary"
            size={isNarrow ? 'sm' : 'md'}
            onClick={handleNext}
            loading={isLast ? completionLoading : false}
            disabled={currentStep.isValid === false}
          >
            {isLast ? completionLabel : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
