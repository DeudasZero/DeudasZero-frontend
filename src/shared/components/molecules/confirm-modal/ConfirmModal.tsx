import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { FC } from 'react'
import { Button } from '@atoms/button/Button.tsx'
import type { ConfirmModalProps, ConfirmModalVariant } from './ConfirmModal.types.ts'

type VariantTokens = { confirmVariant: 'primary' | 'danger'; iconColor: string }

const VARIANT_TOKENS: Record<ConfirmModalVariant, VariantTokens> = {
  danger: { confirmVariant: 'danger', iconColor: 'var(--dz-expense)' },
  warning: { confirmVariant: 'primary', iconColor: 'var(--dz-debt)' },
  info: { confirmVariant: 'primary', iconColor: 'var(--dz-saving)' },
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const { confirmVariant, iconColor } = VARIANT_TOKENS[variant]

  // Lock scroll while open
  useEffect(() => {
    if (!open) return undefined

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8,13,18,0.72)',
        padding: '24px',
        backdropFilter: 'blur(2px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--dz-bg-surface)',
          border: '1px solid var(--dz-border-base)',
          borderRadius: 'var(--dz-r-lg)',
          padding: '28px 24px 24px',
          boxShadow: 'var(--dz-shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2
            id="confirm-modal-title"
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h3)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            <span
              aria-hidden
              style={{
                color: iconColor,
                marginRight: '8px',
                fontSize: '15px',
              }}
            >
              {variant === 'danger' ? '⚠' : variant === 'warning' ? '⚠' : 'ℹ'}
            </span>
            {title}
          </h2>

          {description && (
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--dz-font-sans)',
                fontSize: 'var(--dz-fs-body)',
                color: 'var(--dz-text-secondary)',
                lineHeight: 'var(--dz-lh-body)',
                letterSpacing: 'var(--dz-ls-normal)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <Button variant="ghost" size="md" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} size="md" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
