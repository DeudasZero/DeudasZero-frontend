import type { FC } from 'react'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import { Badge } from '@atoms/badge/Badge.tsx'
import type { Profile, AccountStatus } from '../types/profile.types.ts'

interface ProfileHeroCardProps {
  profile: Profile
}

const STATUS_LABEL: Record<AccountStatus, string> = {
  active: 'Cuenta activa',
  inactive: 'Cuenta inactiva',
  suspended: 'Cuenta suspendida',
}

const STATUS_ACCENT = {
  active: 'income',
  inactive: 'neutral',
  suspended: 'expense',
} as const

export const ProfileHeroCard: FC<ProfileHeroCardProps> = ({ profile }) => {
  const firstName = profile.basic.name.split(' ')[0] ?? profile.basic.name

  return (
    <div
      style={{
        background: 'var(--dz-bg-surface)',
        border: '1px solid var(--dz-border-base)',
        borderRadius: 'var(--dz-r-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
      }}
    >
      {/* Avatar */}
      <Avatar name={profile.basic.name} size="lg" accent="signature" />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 4px',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'var(--dz-signature)',
          }}
        >
          Hola, {firstName.toUpperCase()}
        </p>

        <h2
          style={{
            margin: '0 0 6px',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-h1)',
            fontWeight: 700,
            letterSpacing: 'var(--dz-ls-tight)',
            color: 'var(--dz-text-primary)',
            lineHeight: 1.1,
          }}
        >
          Datos personales
        </h2>

        <p
          style={{
            margin: '0 0 12px',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: 'var(--dz-fs-body)',
            color: 'var(--dz-text-muted)',
            lineHeight: 'var(--dz-lh-body)',
            maxWidth: '480px',
          }}
        >
          Mantén tu información actualizada para que el consejero IA calibre el plan a tu realidad.
        </p>

        {/* Post-MVP pill */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--dz-r-pill)',
            border: '1px solid var(--dz-border-strong)',
            fontFamily: 'var(--dz-font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--dz-text-faint)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--dz-text-faint)',
            }}
          />
          Foto de perfil · Post-MVP
        </span>
      </div>

      {/* Status badge */}
      <Badge accent={STATUS_ACCENT[profile.accountStatus]} size="sm">
        {STATUS_LABEL[profile.accountStatus]}
      </Badge>
    </div>
  )
}
