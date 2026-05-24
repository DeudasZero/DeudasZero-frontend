import { useState, type FC } from 'react'
import { Input } from '@atoms/input/Input.tsx'
import { Button } from '@atoms/button/Button.tsx'
import type { BasicInfoFormValues, ProfileFormErrors } from '../types/profile.types.ts'
import { validateBasicInfo, formatLastEdited } from '../utils/profile.utils.ts'

interface BasicInfoSectionProps {
  initialValues: BasicInfoFormValues
  lastEdited: string
  isSaving: boolean
  onSave: (values: BasicInfoFormValues) => void
}

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

export const BasicInfoSection: FC<BasicInfoSectionProps> = ({
  initialValues,
  lastEdited,
  isSaving,
  onSave,
}) => {
  const [values, setValues] = useState<BasicInfoFormValues>(initialValues)
  const [errors, setErrors] = useState<ProfileFormErrors<BasicInfoFormValues>>({})
  const [dirty, setDirty] = useState(false)

  function set<K extends keyof BasicInfoFormValues>(key: K, val: BasicInfoFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setDirty(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateBasicInfo(values)
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
            Sección 01
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
            Información básica
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--dz-text-faint)',
            marginTop: '4px',
          }}
        >
          Última edición · {formatLastEdited(lastEdited)}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <Input
            label="NOMBRE COMPLETO"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            {...(errors.name !== undefined && { error: errors.name })}
            fullWidth
            placeholder="Mariana López"
          />
          <Input
            label="CORREO ELECTRÓNICO"
            type="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            {...(errors.email !== undefined && { error: errors.email })}
            fullWidth
            placeholder="mariana@ejemplo.com"
          />
          <div>
            <Input
              label="TELÉFONO"
              type="tel"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              {...(errors.phone !== undefined && { error: errors.phone })}
              fullWidth
              placeholder="+57 300 000 0000"
            />
            <p
              style={{
                margin: '6px 0 0',
                fontFamily: 'var(--dz-font-sans)',
                fontSize: '12px',
                color: 'var(--dz-text-faint)',
              }}
            >
              Para alertas de pago
            </p>
          </div>
          <Input
            label="CIUDAD"
            value={values.city}
            onChange={(e) => set('city', e.target.value)}
            fullWidth
            placeholder="Bogotá"
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
