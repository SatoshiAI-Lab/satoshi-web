import LoginDialog from '@/components/login-dialog'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SignUp() {
  const [open, setOpen] = useState(true)

  const router = useRouter()

  const onClose = () => {
    router.back()
    setOpen(false)
  }
  return (
    <>
      <LoginDialog signin={false} open={open} onClose={onClose} />
    </>
  )
}
