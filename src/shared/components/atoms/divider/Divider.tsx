import type { FC } from 'react'
import type { DividerProps, DividerSpacing } from './Divider.types.ts'

const SPACING: Record<DividerSpacing, string> = {
  sm: '8px',
  md: '16px',
  lg: '24px',
}

export const Divider: FC<DividerProps> = ({
  vertical = false,
  label,
  spacing = 'md',
  className,
}) => {
  const gap = SPACING[spacing]

  if (vertical) {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={className}
        style={{
          display: 'inline-block',
          width: '1px',
          alignSelf: 'stretch',
          background: 'var(--dz-border-base)',
          margin: `0 ${gap}`,
          flexShrink: 0,
        }}
      />
    )
  }

  if (label) {
    return (
      <div
        role="separator"
        className={className}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: `${gap} 0` }}
      >
        <span style={{ flex: 1, height: '1px', background: 'var(--dz-border-base)' }} />
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10.5px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--dz-text-faint)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <span style={{ flex: 1, height: '1px', background: 'var(--dz-border-base)' }} />
      </div>
    )
  }

  return (
    <hr
      className={className}
      style={{
        border: 'none',
        borderTop: '1px solid var(--dz-border-base)',
        margin: `${gap} 0`,
        width: '100%',
        flexShrink: 0,
      }}
    />
  )
}
