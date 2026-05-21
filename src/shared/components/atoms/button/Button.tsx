import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import type { DZVariant } from '../tokens/types.ts'
import type { ButtonProps, ButtonSize } from './Button.types.ts'

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { height: '32px', padding: '0 12px', fontSize: '12.5px' },
  md: { height: '40px', padding: '0 16px', fontSize: '14px' },
  lg: { height: '48px', padding: '0 20px', fontSize: '15px' },
}

const VARIANT_STYLES: Record<DZVariant, CSSProperties> = {
  primary: {
    background: 'var(--dz-signature)',
    color: 'var(--dz-bg-page)',
  },
  secondary: {
    background: 'var(--dz-bg-raised)',
    color: 'var(--dz-text-primary)',
    borderColor: 'var(--dz-border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--dz-text-primary)',
    borderColor: 'var(--dz-border-base)',
  },
  danger: {
    background: 'var(--dz-tint-expense)',
    color: 'var(--dz-expense)',
    borderColor: 'rgba(224,122,156,.25)',
  },
}

const ButtonSpinner = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 20 20"
    fill="none"
    style={{ animation: 'dz-btn-spin .7s linear infinite', flexShrink: 0 }}
  >
    <style>{`@keyframes dz-btn-spin { to { transform: rotate(360deg) } }`}</style>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity=".25" />
    <path d="M10 2a8 8 0 0 1 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    iconLeft,
    iconRight,
    iconOnly = false,
    fullWidth = false,
    loading = false,
    disabled,
    children,
    style,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading

  const computedStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: '1px solid transparent',
    borderRadius: 'var(--dz-r-sm)',
    fontFamily: 'var(--dz-font-sans)',
    fontWeight: 600,
    letterSpacing: '-0.005em',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition:
      'background var(--dz-transition-fast), border-color var(--dz-transition-fast), opacity var(--dz-transition-fast)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    flexShrink: 0,
    ...SIZE_STYLES[size],
    ...VARIANT_STYLES[variant],
    ...(fullWidth && { width: '100%' }),
    ...(iconOnly && { padding: 0, width: SIZE_STYLES[size].height }),
    ...(isDisabled && { opacity: 0.45, pointerEvents: 'none' }),
    ...style,
  }

  return (
    <button ref={ref} disabled={isDisabled} style={computedStyle} {...rest}>
      {loading ? <ButtonSpinner /> : iconLeft}
      {!iconOnly && children}
      {!loading && iconRight}
    </button>
  )
})

Button.displayName = 'Button'
