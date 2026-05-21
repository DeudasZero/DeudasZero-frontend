import { forwardRef, useId, useState } from 'react'
import type { InputProps, InputSize } from './Input.types.ts'

const HEIGHT: Record<InputSize, string> = {
  sm: '34px',
  md: '42px',
  lg: '48px',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    prefix,
    suffix,
    size = 'md',
    fullWidth = false,
    id: externalId,
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = externalId ?? autoId
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
        style={{
          display: 'flex',
          alignItems: 'center',
          height: HEIGHT[size],
          paddingInline: '14px',
          gap: '8px',
          background: 'var(--dz-bg-sunken)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--dz-r-sm)',
          transition: 'border-color var(--dz-transition-fast)',
          width: fullWidth ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {prefix && (
          <span
            style={{
              color: 'var(--dz-text-muted)',
              fontSize: 'var(--dz-fs-body)',
              lineHeight: 0,
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          aria-invalid={hasError || undefined}
          aria-describedby={error || hint ? `${id}-desc` : undefined}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--dz-text-primary)',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            letterSpacing: '-0.005em',
            lineHeight: 1,
            minWidth: 0,
            padding: 0,
            ...style,
          }}
          {...rest}
        />

        {suffix && (
          <span
            style={{
              color: 'var(--dz-text-muted)',
              fontSize: 'var(--dz-fs-body)',
              lineHeight: 0,
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {suffix}
          </span>
        )}
      </div>

      {(error || hint) && (
        <span
          id={`${id}-desc`}
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
})

Input.displayName = 'Input'
