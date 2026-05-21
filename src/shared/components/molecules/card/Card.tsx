import type { CSSProperties, FC } from 'react'
import type { CardProps, CardPadding, CardSurface } from './Card.types.ts'

const PADDING: Record<CardPadding, string> = {
  sm: 'var(--dz-sp-4)',
  md: 'var(--dz-sp-6)',
  lg: 'var(--dz-sp-8)',
}

const SURFACE_BG: Record<CardSurface, string> = {
  surface: 'var(--dz-bg-surface)',
  raised: 'var(--dz-bg-raised)',
  sunken: 'var(--dz-bg-sunken)',
}

export const Card: FC<CardProps> = ({
  children,
  padding = 'md',
  surface = 'surface',
  noBorder = false,
  onClick,
  className,
}) => {
  const isInteractive = Boolean(onClick)

  const style: CSSProperties = {
    background: SURFACE_BG[surface],
    border: noBorder ? 'none' : '1px solid var(--dz-border-base)',
    borderRadius: 'var(--dz-r-md)',
    padding: PADDING[padding],
    transition: isInteractive
      ? 'border-color var(--dz-transition-fast), box-shadow var(--dz-transition-fast)'
      : undefined,
    cursor: isInteractive ? 'pointer' : undefined,
  }

  if (isInteractive) {
    return (
      <div
        role="button"
        tabIndex={0}
        style={style}
        className={className}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.()
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div style={style} className={className}>
      {children}
    </div>
  )
}
