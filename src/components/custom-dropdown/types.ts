export interface CustomDropdownItem {
  key: string | number
  label: string
}

export interface CustomDropdownProps {
  children: React.ReactElement | string
  items: CustomDropdownItem[]
  active?: CustomDropdownItem['key']
  showArrow?: boolean
  arrowSize?: number
  theme?: React.CSSProperties
  onItemClick?: (item: CustomDropdownItem) => void
  onOpen?: (open: true) => void
  onClose?: (open: false) => void
}
