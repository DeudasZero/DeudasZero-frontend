import type { CSSProperties, FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import { ProgressBar } from '@atoms/progress-bar/ProgressBar.tsx'
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

  return (
    <div
      className={`flex flex-col bg-(--dz-bg-surface) border border-(--dz-border-base) rounded-(--dz-r-lg) lg:rounded-(--dz-r-xl) overflow-hidden max-w-160 w-full ${className ?? ''}`}
    >
      <div className="flex flex-col gap-3 p-[16px_16px_14px] border-b border-(--dz-border-soft) lg:gap-4 lg:p-[24px_32px_20px]">
        <div className="lg:hidden flex items-center gap-1.5">
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

        <div
          role="list"
          aria-label="Pasos del proceso"
          className="hidden lg:flex items-center gap-1.5"
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

        <ProgressBar value={progress} accent="signature" size="xs" />

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
            className="m-0 font-semibold text-(--dz-fs-h3) lg:text-(--dz-fs-h2)"
            style={{
              fontFamily: 'var(--dz-font-sans)',
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

      <div className="flex-1 p-[20px_16px] lg:p-[28px_32px]">{currentStep.content}</div>

      <div className="flex items-center justify-between gap-2.5 flex-wrap p-[14px_16px_16px] border-t border-(--dz-border-soft) lg:flex-nowrap lg:p-[14px_32px_24px]">
        <div>
          {onSkip && currentStep.isOptional && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Omitir
            </Button>
          )}
        </div>
        <div className="flex gap-2 flex-1 justify-end lg:flex-none">
          {!isFirst && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBack}
              className="lg:h-10! lg:px-4! lg:text-sm!"
            >
              Atrás
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            loading={isLast ? completionLoading : false}
            disabled={currentStep.isValid === false}
            className="lg:h-10! lg:px-4! lg:text-sm!"
          >
            {isLast ? completionLabel : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
