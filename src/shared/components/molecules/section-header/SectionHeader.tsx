import type { FC } from 'react'
import type { SectionHeaderProps } from './SectionHeader.types.ts'

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  divider = false,
  className,
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      paddingBottom: divider ? '16px' : 0,
      borderBottom: divider ? '1px solid var(--dz-border-base)' : 'none',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-h2)',
          fontWeight: 600,
          color: 'var(--dz-text-primary)',
          letterSpacing: 'var(--dz-ls-snug)',
          lineHeight: 'var(--dz-lh-heading)',
        }}
      >
        {title}
      </h2>

      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>

    {subtitle && (
      <p
        style={{
          margin: 0,
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-body)',
          color: 'var(--dz-text-muted)',
          lineHeight: 'var(--dz-lh-body)',
          letterSpacing: 'var(--dz-ls-normal)',
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
)
