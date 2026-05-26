import type { ReactNode } from 'react'

export interface IconButtonProps {
  onClick: () => void
  disabled?: boolean
  label: string
  title: string
  hoverBorder: string
  hoverColor: string
  children: ReactNode
}
