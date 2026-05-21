import type { CSSProperties, FC } from 'react'
import type { AlertProps, AlertVariant } from './Alert.types.ts'

type AlertTokens = { bg: string; border: string; color: string }

const TOKENS: Record<AlertVariant, AlertTokens> = {
  info: {
    bg: 'var(--dz-tint-saving)',
    border: 'rgba(143,168,240,0.25)',
    color: 'var(--dz-saving)',
  },
  success: {
    bg: 'var(--dz-tint-income)',
    border: 'rgba(94,225,230,0.25)',
    color: 'var(--dz-income)',
  },
  warning: { bg: 'var(--dz-tint-debt)', border: 'rgba(240,181,122,0.25)', color: 'var(--dz-debt)' },
  danger: {
    bg: 'var(--dz-tint-expense)',
    border: 'rgba(224,122,156,0.25)',
    color: 'var(--dz-expense)',
  },
}

const ICONS: Record<AlertVariant, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  danger: '✕',
}

export const Alert: FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
}) => {
  const { bg, border, color } = TOKENS[variant]

  const rootStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '14px 16px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 'var(--dz-r-md)',
  }

  return (
    <div role="alert" style={rootStyle} className={className}>
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px',
          color,
          fontWeight: 600,
          marginTop: '1px',
        }}
      >
        {ICONS[variant]}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-body)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-normal)',
            }}
          >
            {title}
          </p>
        )}
        <div
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            color: 'var(--dz-text-secondary)',
            lineHeight: 'var(--dz-lh-body)',
            letterSpacing: 'var(--dz-ls-normal)',
          }}
        >
          {children}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar alerta"
          style={{
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--dz-text-muted)',
            padding: '2px',
            fontSize: '16px',
            lineHeight: 1,
            transition: 'color var(--dz-transition-fast)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
