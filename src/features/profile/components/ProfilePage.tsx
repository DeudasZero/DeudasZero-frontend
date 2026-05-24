import { useEffect, type FC } from 'react'
import { Skeleton } from '@atoms/skeleton/Skeleton.tsx'
import { Alert } from '@molecules/alert/Alert.tsx'
import { useProfile } from '../hooks/useProfile.ts'
import { ProfileHeroCard } from './ProfileHeroCard.tsx'
import { BasicInfoSection } from './BasicInfoSection.tsx'
import { FinancialBaseSection } from './FinancialBaseSection.tsx'

export const ProfilePage: FC = () => {
  const {
    profile,
    isLoading,
    isSaving,
    error,
    successMessage,
    saveBasicInfo,
    saveFinancialBase,
    clearMessages,
  } = useProfile()

  useEffect(() => {
    if (!successMessage) return
    const t = setTimeout(clearMessages, 4000)
    return () => clearTimeout(t)
  }, [successMessage, clearMessages])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Hero skeleton */}
        <div
          style={{
            background: 'var(--dz-bg-surface)',
            border: '1px solid var(--dz-border-base)',
            borderRadius: 'var(--dz-r-lg)',
            padding: '24px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <Skeleton width="48px" height="48px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <Skeleton width="120px" height="12px" />
            <Skeleton width="200px" height="28px" />
            <Skeleton width="340px" height="14px" />
          </div>
        </div>

        {/* Section skeletons */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              background: 'var(--dz-bg-surface)',
              border: '1px solid var(--dz-border-base)',
              borderRadius: 'var(--dz-r-lg)',
              padding: '24px',
            }}
          >
            <Skeleton width="160px" height="22px" />
            <div
              style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              {[0, 1, 2, 3].map((j) => (
                <div key={j}>
                  <Skeleton width="100px" height="10px" />
                  <div style={{ marginTop: '8px' }}>
                    <Skeleton width="100%" height="42px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!profile) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Toast notifications */}
      {error && (
        <Alert variant="danger" onDismiss={clearMessages}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert variant="success" onDismiss={clearMessages}>
          {successMessage}
        </Alert>
      )}

      {/* Hero */}
      <ProfileHeroCard profile={profile} />

      {/* Sección 01 — Información básica */}
      <BasicInfoSection
        initialValues={profile.basic}
        lastEdited={profile.lastEdited}
        isSaving={isSaving}
        onSave={saveBasicInfo}
      />

      {/* Sección 02 — Base financiera */}
      <FinancialBaseSection
        initialValues={profile.financial}
        isSaving={isSaving}
        onSave={saveFinancialBase}
      />
    </div>
  )
}
