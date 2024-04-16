import { useState } from 'react'
import { useRouter } from 'next/router'

import LoginDialog from '@/components/login-dialog'

export default function SignUp() {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const onClose = () => {
    router.back()
    setOpen(false)
  }

  return <LoginDialog signin={false} open={open} onClose={onClose} />
}
