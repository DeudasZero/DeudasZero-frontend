import type { CSSProperties, FC } from 'react'
import type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb.types.ts'

const SEPARATOR = (
  <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M4.5 2.5L7.5 6L4.5 9.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const itemStyle = (isLast: boolean): CSSProperties => ({
  fontFamily: 'var(--dz-font-sans)',
  fontSize: 'var(--dz-fs-caption)',
  fontWeight: isLast ? 500 : 400,
  color: isLast ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
  letterSpacing: '-0.005em',
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: isLast ? 'default' : 'pointer',
  transition: 'color var(--dz-transition-fast)',
  whiteSpace: 'nowrap',
})

function BreadcrumbLink({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  const style = itemStyle(isLast)

  if (isLast) {
    return (
      <span aria-current="page" style={style}>
        {item.label}
      </span>
    )
  }

  if (item.href) {
    return (
      <a href={item.href} style={{ ...style, color: 'var(--dz-text-muted)' }}>
        {item.label}
      </a>
    )
  }

  return (
    <button type="button" onClick={item.onClick} style={style}>
      {item.label}
    </button>
  )
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items, className }) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flexWrap: 'wrap',
      }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <li key={item.label + i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BreadcrumbLink item={item} isLast={isLast} />
            {!isLast && (
              <span style={{ color: 'var(--dz-text-faint)', lineHeight: 0 }}>{SEPARATOR}</span>
            )}
          </li>
        )
      })}
    </ol>
  </nav>
)
