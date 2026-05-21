import { forwardRef, useId, useRef, useState } from 'react'
import type { ChangeEvent, RefObject } from 'react'
import type { TextareaProps } from './Textarea.types.ts'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    fullWidth = false,
    autoResize = false,
    id: externalId,
    onChange,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = externalId ?? autoId
  const [focused, setFocused] = useState(false)
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const resolvedRef = (ref as RefObject<HTMLTextAreaElement>) ?? internalRef
  const hasError = Boolean(error)

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (autoResize && resolvedRef.current) {
      resolvedRef.current.style.height = 'auto'
      resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`
    }
    onChange?.(e)
  }

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

      <textarea
        ref={resolvedRef}
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
        onChange={handleChange}
        style={{
          display: 'block',
          width: fullWidth ? '100%' : undefined,
          minHeight: '90px',
          padding: '10px 14px',
          background: 'var(--dz-bg-sunken)',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--dz-r-sm)',
          color: 'var(--dz-text-primary)',
          fontFamily: 'var(--dz-font-sans)',
          fontSize: 'var(--dz-fs-body)',
          letterSpacing: '-0.005em',
          lineHeight: 'var(--dz-lh-body)',
          resize: autoResize ? 'none' : 'vertical',
          transition: 'border-color var(--dz-transition-fast)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        {...rest}
      />

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

Textarea.displayName = 'Textarea'
