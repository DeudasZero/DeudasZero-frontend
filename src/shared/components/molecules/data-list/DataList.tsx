import type { FC } from 'react'
import type { DataListProps } from './DataList.types.ts'

export const DataList: FC<DataListProps> = ({ entries, layout = 'horizontal', className }) => {
  const isHorizontal = layout === 'horizontal'

  return (
    <dl
      className={className}
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: isHorizontal ? 0 : '12px',
      }}
    >
      {entries.map((entry, i) => (
        <div
          key={entry.label + i}
          style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            justifyContent: isHorizontal ? 'space-between' : undefined,
            alignItems: isHorizontal ? 'center' : 'flex-start',
            gap: isHorizontal ? '16px' : '4px',
            padding: isHorizontal ? '10px 0' : 0,
            borderBottom:
              isHorizontal && i < entries.length - 1 ? '1px solid var(--dz-border-soft)' : 'none',
          }}
        >
          <dt
            style={{
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              fontWeight: 400,
              color: 'var(--dz-text-muted)',
              letterSpacing: '-0.005em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {entry.label}
          </dt>
          <dd
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-body)',
              fontWeight: entry.accent ? 500 : 400,
              color: entry.accent ? 'var(--dz-text-primary)' : 'var(--dz-text-secondary)',
              letterSpacing: '-0.005em',
              textAlign: isHorizontal ? 'right' : 'left',
            }}
          >
            {entry.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
