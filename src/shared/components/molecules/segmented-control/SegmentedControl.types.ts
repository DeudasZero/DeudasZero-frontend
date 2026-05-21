export interface SegmentedOption<T extends string = string> {
  value: T
  label: string
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  fullWidth?: boolean
  className?: string
}
