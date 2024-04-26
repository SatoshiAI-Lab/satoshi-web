import React, { useEffect, useState } from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { IoLogOutOutline } from 'react-icons/io5'
import { toast } from 'react-hot-toast'

import { useUserStore } from '@/stores/use-user-store'
import { utilFmt } from '@/utils/format'
import { useShow } from '@/hooks/use-show'
import { LoginDialog } from './login-dialog'
import { useChatStore } from '@/stores/use-chat-store'

export const LoginButtons = () => {
  const [isSignIn, setSignInStatus] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { t } = useTranslation()
  const { show, open, hidden } = useShow()
  const { isLogined, userInfo, logout, fetchUserInfo } = useUserStore()
  const { socket, setMessages } = useChatStore()
  const openLogoutWallet = Boolean(anchorEl)

  const handleLogoutClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCreatClose = () => {
    setAnchorEl(null)
  }

  const onLogout = () => {
    socket?.close(1000)
    // if (socket?.CLOSED == 3) {
    logout()
    setMessages([])
    handleCreatClose()
    toast.success(t('logout.success'))
    // }
  }
  const changeStatus = (status: boolean) => {
    setSignInStatus(status)
    open()
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <>
      {isLogined ? (
        <div className="ml-4 mr-10" onClick={(e) => handleLogoutClick(e)}>
          <Button
            variant="contained"
            classes={{
              root: clsx(' max-sm:!mx-4 !rounded-full'),
            }}
          >
            <span className="truncate max-w-[120px] ">
              {utilFmt.email(userInfo?.email)}
            </span>
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="text"
            color="primary"
            classes={{
              root: clsx(
                '!ml-10 !mr-2 max-sm:!mx-4 !rounded-full !text-black dark:!text-white'
              ),
            }}
            onClick={() => changeStatus(true)}
          >
            {t('login.tosignin')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            classes={{
              root: clsx('!mr-10 max-sm:!mx-4 !rounded-full'),
            }}
            onClick={() => changeStatus(false)}
          >
            {t('register')}
          </Button>
        </>
      )}
      <Menu
        anchorEl={anchorEl}
        open={openLogoutWallet}
        onClose={handleCreatClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          root: 'mt-2',
          list: '!p-[0px]',
        }}
      >
        <MenuItem
          onClick={onLogout}
          className={clsx(
            'flex flex-col !items-start !justify-center',
            '!text-zinc-600 dark:!text-gray-300'
          )}
        >
          <div className="w-full flex justify-between items-center text-[16px]">
            <span className="mr-2">{t('logout')}</span>
            <IoLogOutOutline />
          </div>
        </MenuItem>
      </Menu>
      <LoginDialog signin={isSignIn} open={show} onClose={hidden} />
    </>
  )
}

export default LoginButtons
