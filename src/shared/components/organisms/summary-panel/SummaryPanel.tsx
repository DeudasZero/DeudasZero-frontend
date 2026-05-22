import type { FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
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
const TREND_ARROW: Record<string, string> = { up: '↑', down: '↓', neutral: '→' }

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
  const bgColor = surface === 'raised' ? 'var(--dz-bg-raised)' : 'var(--dz-bg-surface)'

  const desktopCols = Math.min(metrics.length, 3)

  return (
    <div
      style={{
        background: bgColor,
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        overflow: 'hidden',
      }}
      className={`flex flex-col ${className ?? ''}`}
    >
      {(title || actions.length > 0) && (
        <div className="flex flex-col gap-3 p-[16px_16px_14px] border-b border-(--dz-border-soft) lg:flex-row lg:items-start lg:justify-between lg:p-[20px_24px_16px]">
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
            <div className="flex gap-2 items-center shrink-0 flex-wrap w-full lg:w-auto">
              {actions.map((action: SummaryPanelAction, i: number) => (
                <Button
                  key={i}
                  variant={action.variant ?? 'ghost'}
                  size="sm"
                  onClick={action.onClick}
                  className="w-full lg:w-auto"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        style={{ display: 'grid', gridTemplateColumns: `repeat(2, 1fr)` }}
        className={`lg:grid-cols-${desktopCols}`}
      >
        {metrics.map((metric: SummaryPanelMetric, i: number) => {
          const accentColor = metric.accent ? ACCENT_COLOR[metric.accent] : 'var(--dz-text-primary)'
          const mobileCols = 2
          const colMobile = i % mobileCols
          const isLastColMobile = colMobile === mobileCols - 1
          const totalRowsMobile = Math.ceil(metrics.length / mobileCols)
          const currentRowMobile = Math.floor(i / mobileCols)
          const isLastRowMobile = currentRowMobile === totalRowsMobile - 1

          const colDesktop = i % desktopCols
          const isLastColDesktop = colDesktop === desktopCols - 1
          const totalRowsDesktop = Math.ceil(metrics.length / desktopCols)
          const currentRowDesktop = Math.floor(i / desktopCols)
          const isLastRowDesktop = currentRowDesktop === totalRowsDesktop - 1

          const rightBorder = isLastColMobile
            ? isLastColDesktop
              ? ''
              : 'lg:border-r'
            : isLastColDesktop
              ? 'border-r lg:border-r-0'
              : 'border-r'
          const bottomBorder = isLastRowMobile
            ? isLastRowDesktop
              ? ''
              : 'lg:border-b'
            : isLastRowDesktop
              ? 'border-b lg:border-b-0'
              : 'border-b'

          return (
            <div
              key={metric.id}
              className={`p-4 lg:p-[20px_24px] flex flex-col gap-1.75 min-w-0 border-(--dz-border-soft) ${rightBorder} ${bottomBorder}`}
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
                  <Skeleton width="70%" height="20px" />
                  <Skeleton width="40%" height="11px" />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    className="text-(--dz-fs-h3) lg:text-(--dz-fs-h2) font-semibold overflow-hidden text-ellipsis whitespace-nowrap leading-none"
                    style={{
                      fontFamily: 'var(--dz-font-sans)',
                      color: accentColor,
                      letterSpacing: 'var(--dz-ls-tight)',
                      fontVariantNumeric: 'tabular-nums',
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
          className="p-[12px_16px] lg:p-[14px_24px] border-t border-(--dz-border-soft)"
          style={{ background: 'var(--dz-bg-raised)' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
