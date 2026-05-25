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
    className={`flex flex-col items-center justify-center text-center px-6 py-12 gap-4 ${className ?? ''}`}
  >
    {icon && (
      <span
        aria-hidden
        className="flex items-center justify-center w-12 h-12 rounded-(--dz-r-md) bg-(--dz-bg-raised) border border-(--dz-border-base) text-(--dz-text-faint) text-[22px] mb-1"
      >
        {icon}
      </span>
    )}
    <div className="flex flex-col gap-2 max-w-[320px]">
      <h3 className="m-0 font-sans text-(length:--dz-fs-h3) font-semibold text-(--dz-text-primary) tracking-(--dz-ls-snug)">
        {title}
      </h3>
      {description && (
        <p className="m-0 font-sans text-(length:--dz-fs-body) text-(--dz-text-muted) leading-(--dz-lh-body) tracking-(--dz-ls-normal)">
          {description}
        </p>
      )}
    </div>
    {(action ?? secondaryAction) && (
      <div className="flex gap-2.5 mt-1">
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
