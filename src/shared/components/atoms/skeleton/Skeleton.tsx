import type { FC } from 'react'
import type { SkeletonProps } from './Skeleton.types.ts'

export const Skeleton: FC<SkeletonProps> = ({
  width = '100%',
  height = '14px',
  rounded = false,
  circle = false,
  className,
}) => {
  const resolvedHeight = circle ? width : height
  const borderRadius = circle ? '50%' : rounded ? 'var(--dz-r-pill)' : 'var(--dz-r-sm)'

  return (
    <>
      <span
        aria-hidden
        className={className}
        style={{
          display: 'inline-block',
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof resolvedHeight === 'number' ? `${resolvedHeight}px` : resolvedHeight,
          borderRadius,
          background:
            'linear-gradient(90deg, var(--dz-bg-raised) 25%, var(--dz-bg-surface) 50%, var(--dz-bg-raised) 75%)',
          backgroundSize: '200% 100%',
          animation: 'dz-shimmer 1.5s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes dz-shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </>
  )
}
