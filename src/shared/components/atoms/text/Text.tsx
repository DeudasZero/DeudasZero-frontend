import type { CSSProperties, ElementType, FC } from 'react'
import type { TextProps, TextVariant, TextColor } from './Text.types.ts'
import type { DZWeight } from '../tokens/types.ts'

const VARIANT_STYLES: Record<TextVariant, CSSProperties> = {
  display: {
    fontFamily: 'var(--dz-font-sans)',
    fontSize: 'var(--dz-fs-display)',
    fontWeight: 'var(--dz-fw-medium)',
    letterSpacing: 'var(--dz-ls-tight)',
    lineHeight: 'var(--dz-lh-display)',
    fontVariantNumeric: 'tabular-nums',
  },
  h1: {
    fontSize: 'var(--dz-fs-h1)',
    fontWeight: 'var(--dz-fw-semibold)',
    letterSpacing: 'var(--dz-ls-snug)',
    lineHeight: 'var(--dz-lh-heading)',
  },
  h2: {
    fontSize: 'var(--dz-fs-h2)',
    fontWeight: 'var(--dz-fw-semibold)',
    letterSpacing: 'var(--dz-ls-snug)',
    lineHeight: 'var(--dz-lh-heading)',
  },
  h3: {
    fontSize: 'var(--dz-fs-h3)',
    fontWeight: 'var(--dz-fw-medium)',
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 'var(--dz-lh-heading)',
  },
  body: {
    fontSize: 'var(--dz-fs-body)',
    fontWeight: 'var(--dz-fw-regular)',
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 'var(--dz-lh-body)',
  },
  caption: {
    fontSize: 'var(--dz-fs-caption)',
    fontWeight: 'var(--dz-fw-regular)',
    letterSpacing: 'var(--dz-ls-normal)',
    lineHeight: 'var(--dz-lh-body)',
  },
  eyebrow: {
    fontFamily: 'var(--dz-font-mono)',
    fontSize: 'var(--dz-fs-eyebrow)',
    fontWeight: 'var(--dz-fw-medium)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--dz-ls-eyebrow)',
    lineHeight: 1,
  },
  mono: {
    fontFamily: 'var(--dz-font-mono)',
    fontSize: 'var(--dz-fs-mono-tab)',
    fontWeight: 'var(--dz-fw-regular)',
    letterSpacing: 'var(--dz-ls-mono)',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 'var(--dz-lh-body)',
  },
}

const COLOR_MAP: Record<TextColor, string> = {
  primary: 'var(--dz-text-primary)',
  secondary: 'var(--dz-text-secondary)',
  muted: 'var(--dz-text-muted)',
  faint: 'var(--dz-text-faint)',
  signature: 'var(--dz-signature)',
  income: 'var(--dz-income)',
  expense: 'var(--dz-expense)',
  saving: 'var(--dz-saving)',
  debt: 'var(--dz-debt)',
}

const WEIGHT_MAP: Record<DZWeight, string> = {
  regular: 'var(--dz-fw-regular)',
  medium: 'var(--dz-fw-medium)',
  semibold: 'var(--dz-fw-semibold)',
  bold: 'var(--dz-fw-bold)',
}

const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  display: 'span',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  eyebrow: 'span',
  mono: 'span',
}

export const Text: FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  as,
  truncate = false,
  tabularNums = false,
  children,
  className,
}) => {
  const Tag = as ?? DEFAULT_TAG[variant]

  const style: CSSProperties = {
    ...VARIANT_STYLES[variant],
    color: COLOR_MAP[color],
    margin: 0,
    ...(weight && { fontWeight: WEIGHT_MAP[weight] }),
    ...(tabularNums && { fontVariantNumeric: 'tabular-nums' }),
    ...(truncate && { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
  }

  return (
    <Tag style={style} className={className}>
      {children}
    </Tag>
  )
}
