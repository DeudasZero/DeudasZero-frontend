import type { FC } from 'react'
import { Avatar } from '@atoms/avatar/Avatar.tsx'
import type { AvatarGroupProps } from './AvatarGroup.types.ts'

const SIZE_PX = { sm: 28, md: 36 } as const

export const AvatarGroup: FC<AvatarGroupProps> = ({ items, max = 4, size = 'md', className }) => {
  const visible = items.slice(0, max)
  const overflow = items.length - max

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {visible.map((item, i) => (
        <span
          key={item.name + i}
          style={{
            marginLeft: i === 0 ? 0 : `-${Math.round(SIZE_PX[size] * 0.28)}px`,
            zIndex: visible.length - i,
            borderRadius: '50%',
            boxShadow: '0 0 0 2px var(--dz-bg-surface)',
            lineHeight: 0,
          }}
        >
          <Avatar name={item.name} src={item.src ?? ''} size={size} />
        </span>
      ))}

      {overflow > 0 && (
        <span
          aria-label={`${overflow} más`}
          style={{
            marginLeft: `-${Math.round(SIZE_PX[size] * 0.28)}px`,
            width: `${SIZE_PX[size]}px`,
            height: `${SIZE_PX[size]}px`,
            borderRadius: '50%',
            background: 'var(--dz-bg-raised)',
            border: '1.5px solid var(--dz-border-strong)',
            boxShadow: '0 0 0 2px var(--dz-bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--dz-font-sans)',
            fontSize: `${Math.round(SIZE_PX[size] * 0.32)}px`,
            fontWeight: 600,
            color: 'var(--dz-text-muted)',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
