export interface AvatarGroupItem {
  name: string
  src?: string
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[]
  max?: number
  size?: 'sm' | 'md'
  className?: string
}
