import type { FC } from 'react'
import type { FormFieldProps } from './FormField.types.ts'

export const FormField: FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  className,
}) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label
      htmlFor={htmlFor}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'var(--dz-font-sans)',
        fontSize: 'var(--dz-fs-caption)',
        fontWeight: 500,
        color: 'var(--dz-text-secondary)',
        letterSpacing: '-0.005em',
        cursor: 'default',
      }}
    >
      {label}
      {required && (
        <span aria-hidden style={{ color: 'var(--dz-expense)', fontSize: '13px', lineHeight: 1 }}>
          *
        </span>
      )}
    </label>

    {children}

    {(error || hint) && (
      <span
        role={error ? 'alert' : undefined}
        style={{
          fontFamily: 'var(--dz-font-sans)',
          fontSize: '12px',
          color: error ? 'var(--dz-expense)' : 'var(--dz-text-muted)',
          lineHeight: 1.4,
          letterSpacing: '-0.005em',
        }}
      >
        {error ?? hint}
      </span>
    )}
  </div>
)
