import type { CSSProperties, ReactNode, SVGProps } from 'react'
import type { TextColor } from '../text/Text.types.ts'

export interface IconProps {
  as?: React.ComponentType<SVGProps<SVGSVGElement>>
  children?: ReactNode
  size?: number | string
  color?: TextColor | 'inherit'
  label?: string
  className?: string
  style?: CSSProperties
}
