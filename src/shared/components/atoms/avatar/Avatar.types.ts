import type { DZAccent } from '../tokens/types.ts'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

export interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  accent?: DZAccent
  className?: string
}
