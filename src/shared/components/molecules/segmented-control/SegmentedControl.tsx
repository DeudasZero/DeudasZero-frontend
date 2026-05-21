import type { CSSProperties, FC } from 'react'
import type { SegmentedControlProps, SegmentedOption } from './SegmentedControl.types.ts'

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--dz-bg-sunken)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-pill)',
        padding: '3px',
        gap: '2px',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {options.map((opt: SegmentedOption<T>) => {
        const isActive = opt.value === value
        const btnStyle: CSSProperties = {
          flex: fullWidth ? 1 : undefined,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 14px',
          borderRadius: 'var(--dz-r-pill)',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-caption)',
          fontWeight: isActive ? 600 : 400,
          letterSpacing: '-0.005em',
          color: isActive ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
          background: isActive ? 'var(--dz-bg-raised)' : 'transparent',
          border: isActive ? '1px solid var(--dz-border-strong)' : '1px solid transparent',
          cursor: opt.disabled ? 'not-allowed' : 'pointer',
          opacity: opt.disabled ? 0.45 : 1,
          transition:
            'background var(--dz-transition-fast), color var(--dz-transition-fast), border-color var(--dz-transition-fast)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          boxShadow: isActive ? 'var(--dz-shadow-sm)' : 'none',
        }

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            style={btnStyle}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Named export alias so it can be used without generics when T = string
export const SegmentedControlBase = SegmentedControl as FC<SegmentedControlProps>
