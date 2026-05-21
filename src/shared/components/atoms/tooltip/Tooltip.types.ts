import type { ReactElement, ReactNode } from 'react'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  placement?: TooltipPlacement
  delay?: number
  children: ReactElement
  disabled?: boolean
}
