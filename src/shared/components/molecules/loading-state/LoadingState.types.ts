export type LoadingStateSize = 'sm' | 'md' | 'lg'

export interface LoadingStateProps {
  label?: string
  size?: LoadingStateSize
  fullPage?: boolean
  className?: string
}
