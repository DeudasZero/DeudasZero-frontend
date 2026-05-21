import type { DZAccent } from '../tokens/types.ts'

export type ProgressBarSize = 'xs' | 'sm' | 'md'

export interface ProgressBarProps {
  value: number
  accent?: DZAccent
  size?: ProgressBarSize
  animate?: boolean
  label?: string
  className?: string
}
