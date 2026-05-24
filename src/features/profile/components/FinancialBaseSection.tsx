import { useState, type FC } from 'react'
import { Input } from '@atoms/input/Input.tsx'
import { Button } from '@atoms/button/Button.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import { Select } from '@atoms/select/Select.tsx'
import type {
  FinancialBaseFormValues,
  ProfileFormErrors,
  IncomeFrequency,
} from '../types/profile.types.ts'
import { validateFinancialBase } from '../utils/profile.utils.ts'

interface FinancialBaseSectionProps {
  initialValues: FinancialBaseFormValues
  isSaving: boolean
  onSave: (values: FinancialBaseFormValues) => void
}

const FREQUENCY_OPTIONS: { value: IncomeFrequency; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'weekly', label: 'Semanal' },
]

const AIIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3L14 9L20 9L15 13L17 19L12 15L7 19L9 13L4 9L10 9Z" fill="currentColor" />
  </svg>
)

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="17 21 17 13 7 13 7 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="7 3 7 8 15 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function parseMoney(raw: string): number {
  return parseInt(raw.replace(/\D/g, ''), 10) || 0
}

function formatMoney(n: number, locale = 'es-CO'): string {
  if (!n) return ''
  return n.toLocaleString(locale)
}

export const FinancialBaseSection: FC<FinancialBaseSectionProps> = ({
  initialValues,
  isSaving,
  onSave,
}) => {
  const [values, setValues] = useState<FinancialBaseFormValues>(initialValues)
  const [errors, setErrors] = useState<ProfileFormErrors<FinancialBaseFormValues>>({})
  const [dirty, setDirty] = useState(false)

  function set<K extends keyof FinancialBaseFormValues>(key: K, val: FinancialBaseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateFinancialBase(values)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave(values)
    setDirty(false)
  }

  return (
    <div
      style={{
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--dz-border-soft)',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--dz-font-mono)',
              fontSize: '10.5px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--dz-text-faint)',
            }}
          >
            Sección 02
          </p>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h2)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            Base financiera
          </h3>
        </div>
        <Badge accent="signature" size="sm">
          <AIIcon /> Usa el consejero IA
        </Badge>
      </div>

      {/* IA hint */}
      <div
        style={{
          margin: '20px 24px 0',
          padding: '12px 14px',
          background: 'var(--dz-tint-signature)',
          border: '1px solid rgba(94,225,230,0.2)',
          borderRadius: 'var(--dz-r-sm)',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <span style={{ fontSize: '15px', flexShrink: 0 }}>💡</span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-caption)',
            color: 'var(--dz-text-secondary)',
            lineHeight: 1.55,
          }}
        >
          Esta información le permite al{' '}
          <strong style={{ color: 'var(--dz-signature)', fontWeight: 600 }}>Consejero IA</strong>{' '}
          calcular cuánto puedes destinar al pago de deudas y optimizar tu plan de liquidación.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            padding: '20px 24px 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <Input
            label="INGRESO MENSUAL"
            value={formatMoney(values.monthlyIncome)}
            onChange={(e) => set('monthlyIncome', parseMoney(e.target.value))}
            prefix="$"
            fullWidth
            placeholder="4.500.000"
            hint="Ingreso neto mensual promedio"
            {...(errors.monthlyIncome !== undefined && { error: errors.monthlyIncome })}
          />
          <Select
            label="FRECUENCIA DE INGRESO"
            options={FREQUENCY_OPTIONS}
            value={values.incomeFrequency}
            onChange={(v) => set('incomeFrequency', v)}
            fullWidth
          />
          <Input
            label="OCUPACIÓN"
            value={values.occupation}
            onChange={(e) => set('occupation', e.target.value)}
            fullWidth
            placeholder="Diseñadora UX, Contador, etc."
            {...(errors.occupation !== undefined && { error: errors.occupation })}
          />
          <Input
            label="GASTOS FIJOS MENSUALES"
            value={formatMoney(values.fixedExpenses)}
            onChange={(e) => set('fixedExpenses', parseMoney(e.target.value))}
            prefix="$"
            fullWidth
            placeholder="1.800.000"
            hint="Arriendo, servicios, alimentación"
            {...(errors.fixedExpenses !== undefined && { error: errors.fixedExpenses })}
          />
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--dz-border-soft)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSaving}
            disabled={!dirty}
            iconLeft={<SaveIcon />}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
