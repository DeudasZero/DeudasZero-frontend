export type DividerSpacing = 'sm' | 'md' | 'lg'

export interface DividerProps {
  vertical?: boolean
  label?: string
  spacing?: DividerSpacing
  className?: string
}
