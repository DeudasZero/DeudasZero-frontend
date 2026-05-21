import type { FC } from 'react'
import { Spinner } from '@atoms/spinner/Spinner.tsx'
import type { LoadingStateProps, LoadingStateSize } from './LoadingState.types.ts'

const FONT_SIZE: Record<LoadingStateSize, string> = {
  sm: 'var(--dz-fs-caption)',
  md: 'var(--dz-fs-body)',
  lg: 'var(--dz-fs-h3)',
}

export const LoadingState: FC<LoadingStateProps> = ({
  label = 'Cargando…',
  size = 'md',
  fullPage = false,
  className,
}) => (
  <div
    aria-busy="true"
    aria-label={label}
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      padding: 'var(--dz-sp-12) var(--dz-sp-6)',
      ...(fullPage && {
        position: 'fixed',
        inset: 0,
        background: 'var(--dz-bg-page)',
        zIndex: 900,
      }),
    }}
  >
    <Spinner size={size} color="signature" label={label} />
    <span
      style={{
        fontFamily: 'var(--dz-font-sans)',
        fontSize: FONT_SIZE[size],
        color: 'var(--dz-text-muted)',
        letterSpacing: '-0.005em',
      }}
    >
      {label}
    </span>
  </div>
)
