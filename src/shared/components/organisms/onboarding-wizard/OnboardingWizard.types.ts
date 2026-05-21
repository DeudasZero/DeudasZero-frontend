import type { ReactNode } from 'react'

export interface WizardStep {
  id: string
  title: string
  description?: string
  content: ReactNode
  isOptional?: boolean
  isValid?: boolean
}

export interface OnboardingWizardProps {
  steps: WizardStep[]
  currentStepIndex: number
  onStepChange: (index: number) => void
  onComplete: () => void
  onSkip?: () => void
  completionLoading?: boolean
  completionLabel?: string
  className?: string
}
