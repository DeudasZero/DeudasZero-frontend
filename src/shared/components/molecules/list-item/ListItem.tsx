import type { FC } from 'react'
import type { ListItemProps } from './ListItem.types.ts'

export const ListItem: FC<ListItemProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  onClick,
  disabled = false,
  className,
}) => {
  const isInteractive = Boolean(onClick)

  const baseClasses = [
    'flex items-center gap-3 px-4 py-3',
    'bg-transparent border-none rounded-[var(--dz-r-sm)]',
    'w-full text-left',
    'transition-colors duration-[var(--dz-transition-fast)]',
    isInteractive && !disabled ? 'cursor-pointer hover:bg-white/[0.03]' : 'cursor-default',
    disabled ? 'opacity-45' : 'opacity-100',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {leading && <span className="shrink-0 leading-none text-(--dz-text-muted)">{leading}</span>}
      <div className="flex-1 min-w-0">
        <p className="m-0 font-sans text-(length:--dz-fs-body) font-medium text-(--dz-text-primary) tracking-(--dz-ls-normal) truncate">
          {title}
        </p>
        {subtitle && (
          <p className="m-0 mt-0.5 font-sans text-(length:--dz-fs-caption) text-(--dz-text-muted) tracking-(-0.005em) truncate">
            {subtitle}
          </p>
        )}
      </div>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        className={`${baseClasses} ${className ?? ''}`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {content}
      </button>
    )
  }

  return <div className={`${baseClasses} ${className ?? ''}`}>{content}</div>
}
