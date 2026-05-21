import type { FC } from 'react'
import type { PageHeaderProps } from './PageHeader.types.ts'

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  eyebrow,
  actions,
  backAction,
  className,
}) => (
  <header
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    {backAction && (
      <button
        type="button"
        onClick={backAction.onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-caption)',
          fontWeight: 500,
          color: 'var(--dz-text-muted)',
          letterSpacing: '-0.005em',
          transition: 'color var(--dz-transition-fast)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M9 11L5 7l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {backAction.label}
      </button>
    )}

    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <span
            style={{
              fontFamily: 'var(--dz-font-mono)',
              fontSize: 'var(--dz-fs-eyebrow)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 'var(--dz-ls-eyebrow)',
              color: 'var(--dz-text-muted)',
            }}
          >
            {eyebrow}
          </span>
        )}

        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-h1)',
            fontWeight: 600,
            color: 'var(--dz-text-primary)',
            letterSpacing: 'var(--dz-ls-snug)',
            lineHeight: 'var(--dz-lh-heading)',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-body)',
              color: 'var(--dz-text-secondary)',
              lineHeight: 'var(--dz-lh-body)',
              letterSpacing: 'var(--dz-ls-normal)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  </header>
)
