import type { FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import type { EmptyStateProps } from './EmptyState.types.ts'

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--dz-sp-12) var(--dz-sp-6)',
      gap: 'var(--dz-sp-4)',
    }}
  >
    {icon && (
      <span
        aria-hidden
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--dz-r-md)',
          background: 'var(--dz-bg-raised)',
          border: '1px solid var(--dz-border-base)',
          color: 'var(--dz-text-faint)',
          fontSize: '22px',
          marginBottom: '4px',
        }}
      >
        {icon}
      </span>
    )}

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-h3)',
          fontWeight: 600,
          color: 'var(--dz-text-primary)',
          letterSpacing: 'var(--dz-ls-snug)',
        }}
      >
        {title}
      </h3>
      {description && (
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
          {description}
        </p>
      )}
    </div>

    {(action || secondaryAction) && (
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        {secondaryAction && (
          <Button
            variant={secondaryAction.variant ?? 'ghost'}
            size="md"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
        {action && (
          <Button variant={action.variant ?? 'primary'} size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    )}
  </div>
)
