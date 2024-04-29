import { IoCloseOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, IconButton } from '@mui/material'
import { clsx } from 'clsx'

import { Routes } from '@/routes'
import { useThemeStore } from '@/stores/use-theme-store'

interface Props {
  show: boolean
  onClose: () => void
}

export const LoginAuthDialog = (props: Props) => {
  const { show, onClose } = props
  const { t } = useTranslation()
  const { push } = useRouter()
  const { isDark } = useThemeStore()

  const toSignup = () => {
    push(Routes.signup).then(() => {
      onClose()
    })
  }

  const toLogin = () => {
    push(Routes.signin).then(() => {
      onClose()
    })
  }

  return (
    <Dialog open={show}>
      <div className="flex justify-end">
        <IconButton onClick={onClose}>
          <IoCloseOutline />
        </IconButton>
      </div>
      <div className="px-10 pb-10">
        <img
          src={isDark ? '/images/logos/white.png' : '/images/logos/black.png'}
          alt="Logo"
          width={230}
          height={30}
        />
        <div className="pt-2 pb-5">{t('need.login.text1')}</div>
        <div className="flex flex-col items-center">
          <img
            src="/images/i3.png"
            alt="Satoshi"
            width={270}
            className="w-[240px] mr-8"
          />
          <Button
            variant="contained"
            className="w-[350px] !text-lg !bg-black !rounded-full"
            size="large"
            disableElevation
            onClick={toSignup}
          >
            {t('register')}
          </Button>
          <div className="py-5">{t('need.login.text2')}</div>
          <Button
            variant="outlined"
            color="inherit"
            className={clsx(
              'w-[350px] !text-lg !border-black !rounded-full',
              'not-used-dark:!border-gray-400'
            )}
            size="large"
            onClick={toLogin}
          >
            {t('signin')}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default LoginAuthDialog
