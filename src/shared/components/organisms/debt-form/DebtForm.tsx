import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { Input } from '@atoms/input/Input.tsx'
import { Select } from '@atoms/select/Select.tsx'
import { Button } from '@atoms/button/Button.tsx'
import { Textarea } from '@atoms/textarea/Textarea.tsx'
import { AmountInput } from '@molecules/amount-input/AmountInput.tsx'
import { Alert } from '@molecules/alert/Alert.tsx'
import { Divider } from '@atoms/divider/Divider.tsx'
import { useBreakpoint } from '@shared/hooks/useBreakpoint.ts'
import type { DebtFormProps, DebtFormValues, DebtFormErrors } from './DebtForm.types.ts'

const DEFAULT_VALUES: DebtFormValues = {
  name: '',
  creditor: '',
  totalDebt: '',
  balance: '',
  interestRate: '',
  minPayment: '',
  nextPaymentDate: '',
  currency: 'COP',
  notes: '',
}

const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'USD', label: 'USD — Dólar estadounidense' },
  { value: 'EUR', label: 'EUR — Euro' },
]

function validate(values: DebtFormValues): DebtFormErrors {
  const errors: DebtFormErrors = {}
  if (!values.name.trim()) errors.name = 'El nombre de la deuda es requerido'
  if (!values.creditor.trim()) errors.creditor = 'El acreedor es requerido'
  if (values.totalDebt === '' || Number(values.totalDebt) <= 0)
    errors.totalDebt = 'Ingresa un monto válido mayor a 0'
  if (values.balance !== '' && Number(values.balance) > Number(values.totalDebt))
    errors.balance = 'El saldo no puede superar el total de la deuda'
  if (
    values.interestRate !== '' &&
    (Number(values.interestRate) < 0 || Number(values.interestRate) > 200)
  )
    errors.interestRate = 'La tasa debe estar entre 0% y 200%'
  return errors
}

export const DebtForm: FC<DebtFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
  className,
}) => {
  const { isNarrow } = useBreakpoint()

  const [values, setValues] = useState<DebtFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  })
  const [errors, setErrors] = useState<DebtFormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Partial<Record<keyof DebtFormValues, boolean>>>({})

  function setField<K extends keyof DebtFormValues>(key: K, value: DebtFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key as keyof DebtFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function touch(key: keyof DebtFormValues) {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setTouched(
        Object.keys(values).reduce(
          (acc, k) => ({ ...acc, [k]: true }),
          {} as Record<keyof DebtFormValues, boolean>,
        ),
      )
      return
    }
    try {
      await onSubmit(values)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ocurrió un error al guardar la deuda.')
    }
  }

  const twoCol = isNarrow ? '1fr' : '1fr 1fr'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={className}
      style={{ display: 'flex', flexDirection: 'column', gap: isNarrow ? '20px' : '24px' }}
    >
      {submitError && (
        <Alert variant="danger" onDismiss={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h3
            style={{
              margin: '0 0 2px',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h3)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            Información básica
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
            }}
          >
            Identifica la deuda y quién es el acreedor
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: '12px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              label="Nombre de la deuda *"
              placeholder="Ej: Tarjeta Visa Bancolombia"
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => touch('name')}
              error={touched.name ? (errors.name ?? '') : ''}
              fullWidth
            />
          </div>
          <Input
            label="Acreedor *"
            placeholder="Ej: Bancolombia"
            value={values.creditor}
            onChange={(e) => setField('creditor', e.target.value)}
            onBlur={() => touch('creditor')}
            error={touched.creditor ? (errors.creditor ?? '') : ''}
            fullWidth
          />
          <Select
            label="Moneda"
            options={CURRENCY_OPTIONS}
            value={values.currency}
            onChange={(v) => setField('currency', v as DebtFormValues['currency'])}
            fullWidth
          />
        </div>
      </section>

      <Divider />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h3
            style={{
              margin: '0 0 2px',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h3)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            Montos
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
            }}
          >
            Define los valores actuales de la deuda
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: '12px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <AmountInput
              label="Deuda total original *"
              value={values.totalDebt === '' ? '' : Number(values.totalDebt)}
              onChange={(v) => setField('totalDebt', v)}
              currency={values.currency}
              error={touched.totalDebt ? (errors.totalDebt ?? '') : ''}
              hint="El monto total cuando tomaste la deuda"
              fullWidth
            />
          </div>
          <AmountInput
            label="Saldo actual"
            value={values.balance === '' ? '' : Number(values.balance)}
            onChange={(v) => setField('balance', v)}
            currency={values.currency}
            error={touched.balance ? (errors.balance ?? '') : ''}
            hint="Lo que debes hoy"
            fullWidth
          />
          <AmountInput
            label="Pago mínimo"
            value={values.minPayment === '' ? '' : Number(values.minPayment)}
            onChange={(v) => setField('minPayment', v)}
            currency={values.currency}
            hint="Pago mínimo mensual"
            fullWidth
          />
        </div>
      </section>

      <Divider />

      <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h3
            style={{
              margin: '0 0 2px',
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-h3)',
              fontWeight: 600,
              color: 'var(--dz-text-primary)',
              letterSpacing: 'var(--dz-ls-snug)',
            }}
          >
            Condiciones
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--dz-font-sans)',
              fontSize: 'var(--dz-fs-caption)',
              color: 'var(--dz-text-muted)',
            }}
          >
            Tasa de interés y fechas de pago
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: '12px' }}>
          <Input
            label="Tasa de interés (% EA)"
            type="number"
            inputMode="decimal"
            min={0}
            max={200}
            step={0.01}
            placeholder="Ej: 28.5"
            value={values.interestRate === '' ? '' : String(values.interestRate)}
            onChange={(e) =>
              setField('interestRate', e.target.value === '' ? '' : parseFloat(e.target.value))
            }
            onBlur={() => touch('interestRate')}
            error={touched.interestRate ? (errors.interestRate ?? '') : ''}
            suffix="%"
            hint="Tasa efectiva anual"
            fullWidth
          />
          <Input
            label="Próximo pago"
            type="date"
            value={values.nextPaymentDate}
            onChange={(e) => setField('nextPaymentDate', e.target.value)}
            fullWidth
          />
        </div>
      </section>

      <Divider />

      <section>
        <Textarea
          label="Notas adicionales"
          placeholder="Condiciones especiales, cuotas pendientes, recordatorios…"
          value={values.notes}
          onChange={(e) => setField('notes', e.target.value)}
          fullWidth
          autoResize
        />
      </section>

      <div
        style={{
          display: 'flex',
          flexDirection: isNarrow ? 'column-reverse' : 'row',
          justifyContent: isNarrow ? undefined : 'flex-end',
          gap: '10px',
          paddingTop: '4px',
        }}
      >
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={loading}
            fullWidth={isNarrow}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" loading={loading} fullWidth={isNarrow}>
          {mode === 'edit' ? 'Guardar cambios' : 'Agregar deuda'}
        </Button>
      </div>
    </form>
  )
}
