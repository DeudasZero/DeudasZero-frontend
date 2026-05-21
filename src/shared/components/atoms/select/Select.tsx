import { useId, useState } from 'react'
import type { SelectProps, SelectSize } from './Select.types.ts'

const HEIGHT: Record<SelectSize, string> = {
  sm: '34px',
  md: '42px',
}

export function Select<V extends string = string>({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  placeholder,
  fullWidth = false,
  disabled = false,
  size = 'md',
  className,
}: SelectProps<V>) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const hasError = Boolean(error)

  const borderColor = hasError
    ? 'var(--dz-expense)'
    : focused
      ? 'var(--dz-border-focus)'
      : 'var(--dz-border-base)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-caption)',
            fontWeight: 500,
            color: 'var(--dz-text-secondary)',
            letterSpacing: '-0.005em',
            cursor: 'default',
          }}
        >
          {label}
        </label>
      )}

      <div
        className={className}
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: fullWidth ? '100%' : undefined,
        }}
      >
        <select
          id={id}
          value={value ?? ''}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange?.(e.target.value as V)}
          style={{
            width: fullWidth ? '100%' : undefined,
            height: HEIGHT[size],
            padding: '0 36px 0 14px',
            background: 'var(--dz-bg-sunken)',
            border: `1.5px solid ${borderColor}`,
            borderRadius: 'var(--dz-r-sm)',
            color: value ? 'var(--dz-text-primary)' : 'var(--dz-text-muted)',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            letterSpacing: '-0.005em',
            transition: 'border-color var(--dz-transition-fast)',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            appearance: 'none',
            WebkitAppearance: 'none',
            boxSizing: 'border-box',
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--dz-text-muted)',
            lineHeight: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {(error || hint) && (
        <span
          style={{
            fontFamily: 'var(--dz-font-sans)',
            fontSize: '12px',
            color: error ? 'var(--dz-expense)' : 'var(--dz-text-muted)',
            lineHeight: 1.4,
          }}
        >
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
