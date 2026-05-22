import type { CSSProperties, FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type {
  SummaryPanelProps,
  SummaryPanelMetric,
  SummaryPanelAction,
} from './SummaryPanel.types.ts'

const ACCENT_COLOR: Record<string, string> = {
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
  signature: 'var(--dz-signature)',
  neutral: 'var(--dz-text-secondary)',
}

const TREND_COLOR: Record<string, string> = {
  up: 'var(--dz-income)',
  down: 'var(--dz-expense)',
  neutral: 'var(--dz-text-muted)',
}

const TREND_ARROW: Record<string, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

export const SummaryPanel: FC<SummaryPanelProps> = ({
  title,
  subtitle,
  metrics,
  actions = [],
  footer,
  loading = false,
  surface = 'surface',
  className,
}) => {
  const { isNarrow } = useBreakpoint()

  const bgColor = surface === 'raised' ? 'var(--dz-bg-raised)' : 'var(--dz-bg-surface)'

  const maxCols = isNarrow ? 2 : Math.min(metrics.length, 3)
  const gridCols = `repeat(${maxCols}, 1fr)`

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    background: bgColor,
    border: '1px solid var(--dz-border-base)',
    borderRadius: 'var(--dz-r-lg)',
    overflow: 'hidden',
  }

  return (
    <div style={rootStyle} className={className}>
      {(title || actions.length > 0) && (
        <div
          style={{
            display: 'flex',
            flexDirection: isNarrow ? 'column' : 'row',
            alignItems: isNarrow ? 'flex-start' : 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            padding: isNarrow ? '16px 16px 14px' : '20px 24px 16px',
            borderBottom: '1px solid var(--dz-border-soft)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {title && (
              <h2
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
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--dz-font-sans)',
                  fontSize: 'var(--dz-fs-caption)',
                  color: 'var(--dz-text-muted)',
                  letterSpacing: '-0.005em',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexShrink: 0,
                width: isNarrow ? '100%' : undefined,
                flexWrap: 'wrap',
              }}
            >
              {actions.map((action: SummaryPanelAction, i: number) => (
                <Button
                  key={i}
                  variant={action.variant ?? 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  fullWidth={isNarrow}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: 0,
        }}
      >
        {metrics.map((metric: SummaryPanelMetric, i: number) => {
          const accentColor = metric.accent ? ACCENT_COLOR[metric.accent] : 'var(--dz-text-primary)'

          const col = i % maxCols
          const isLastCol = col === maxCols - 1
          const totalRows = Math.ceil(metrics.length / maxCols)
          const currentRow = Math.floor(i / maxCols)
          const isLastRow = currentRow === totalRows - 1

          return (
            <div
              key={metric.id}
              style={{
                padding: isNarrow ? '16px' : '20px 24px',
                borderRight: isLastCol ? 'none' : '1px solid var(--dz-border-soft)',
                borderBottom: isLastRow ? 'none' : '1px solid var(--dz-border-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: '7px',
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--dz-font-mono)',
                  fontSize: 'var(--dz-fs-eyebrow)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--dz-ls-eyebrow)',
                  color: 'var(--dz-text-muted)',
                  lineHeight: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {metric.label}
              </span>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <Skeleton width="70%" height={isNarrow ? '20px' : '24px'} />
                  <Skeleton width="40%" height="11px" />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      fontSize: isNarrow ? 'var(--dz-fs-h3)' : 'var(--dz-fs-h2)',
                      fontWeight: 600,
                      color: accentColor,
                      letterSpacing: 'var(--dz-ls-tight)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {metric.value}
                  </div>

                  {metric.subvalue && (
                    <div
                      style={{
                        fontFamily: 'var(--dz-font-sans)',
                        fontSize: 'var(--dz-fs-caption)',
                        color: 'var(--dz-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {metric.subvalue}
                    </div>
                  )}

                  {metric.trend && metric.trendLabel && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontFamily: 'var(--dz-font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: TREND_COLOR[metric.trend],
                        letterSpacing: '0.02em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span aria-hidden>{TREND_ARROW[metric.trend]}</span>
                      {metric.trendLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {footer && (
        <div
          style={{
            padding: isNarrow ? '12px 16px' : '14px 24px',
            borderTop: '1px solid var(--dz-border-soft)',
            background: 'var(--dz-bg-raised)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
