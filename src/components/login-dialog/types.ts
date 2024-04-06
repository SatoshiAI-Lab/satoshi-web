export interface LoginDialogProps {
  open: boolean
  autoFocus?: boolean
  onClose?(): void
  signin?: boolean
}
