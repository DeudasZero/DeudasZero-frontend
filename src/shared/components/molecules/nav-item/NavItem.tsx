import type { FC } from 'react'
import type { NavItemProps } from './NavItem.types.ts'

export const NavItem: FC<NavItemProps> = ({
  label,
  icon,
  href,
  active = false,
  badge,
  onClick,
  className,
}) => {
  const rootClasses = [
    'flex items-center gap-2.5 px-3 py-2',
    'rounded-[var(--dz-r-sm)]',
    'font-sans text-[length:var(--dz-fs-body)] tracking-[var(--dz-ls-normal)]',
    'border-none cursor-pointer no-underline w-full text-left',
    'transition-[background,color] duration-[var(--dz-transition-fast)]',
    active
      ? 'font-semibold text-[var(--dz-text-primary)] bg-[var(--dz-tint-signature)]'
      : 'font-normal text-[var(--dz-text-muted)] bg-transparent',
  ].join(' ')

  const iconClasses = [
    'shrink-0 leading-none transition-colors duration-[var(--dz-transition-fast)]',
    active ? 'text-[var(--dz-signature)]' : 'text-[var(--dz-text-muted)]',
  ].join(' ')

  const inner = (
    <>
      {icon && (
        <span aria-hidden className={iconClasses}>
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          aria-label={`${badge} notificaciones`}
          className="inline-flex items-center justify-center min-w-4.5 h-4.5 px-1.25 rounded-(--dz-r-pill) font-mono text-[10px] font-semibold leading-none tracking-normal text-(--dz-bg-page) bg-(--dz-signature)"
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {active && <span aria-hidden className="w-1 h-1 rounded-full shrink-0 bg-(--dz-signature)" />}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`${rootClasses} ${className ?? ''}`}
        onClick={onClick}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={`${rootClasses} ${className ?? ''}`}
      onClick={onClick}
    >
      {inner}
    </button>
  )
}
