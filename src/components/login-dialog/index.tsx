import { useState, useEffect, KeyboardEvent, useRef } from 'react'
import Image from 'next/image'
import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  Input,
  Link,
  OutlinedInput,
} from '@mui/material'
import { clsx } from 'clsx'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

import type { LoginDialogProps } from './types'

import { useUserStore } from '@/stores/use-user-store'
import { validator } from '@/utils/validator'
import { useShow } from '@/hooks/use-show'
import { useThemeStore } from '@/stores/use-theme-store'

export const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  signin,
  autoFocus = true,
  onClose,
}) => {
  const [isSignIn, setSignIn] = useState(signin)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [validateErr, setValidateErr] = useState<string[]>([])
  const [verifyDialog, setVerifyDialog] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const {
    show: showLoading,
    open: openLoading,
    hidden: closeLoading,
  } = useShow()
  const { t } = useTranslation()
  const { login, register, sendEmailVerify } = useUserStore()
  const { isDark } = useThemeStore()

  const pswRef = useRef<HTMLInputElement>(null)

  // TODO: add forgot password
  const forgotPassword = () => {
    toast('Coming Soon')
  }

  const checkForm = () => {
    const validEmail = validator.checkEmail(userEmail)
    const validPassword = validator.checkPassword(userPassword)
    const validList = []
    if (validEmail !== true) {
      validList.push('Please enter the correct email address')
    }
    if (validPassword !== true) {
      validList.push('Please enter the correct password')
    }
    if (validList.length) {
      setValidateErr(validList)
      return false
    }
    setValidateErr([])
    return true
  }

  const goVerify = () => {
    const result = checkForm()
    if (!result) return
    isSignIn ? goLogin() : goRegister()
  }

  const goLogin = async () => {
    try {
      openLoading()
      await login(userEmail, userPassword)
      toast.success(t('login.successful'))
      clear()
    } catch (e) {
      toast.error(t('login.fail'))
    } finally {
      closeLoading()
    }
  }

  const goRegister = async () => {
    try {
      openLoading()
      await register(userEmail, verifyCode, userPassword)
      toast.success(t('register.successful'))
      clear()
    } catch (e) {
      toast.error(t('register.fail'))
    } finally {
      closeLoading()
    }
  }

  const clear = () => {
    setUserEmail('')
    setUserPassword('')
    onClose?.()
  }

  const accountKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    pswRef.current?.focus()
  }

  const passwordKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    goVerify()
  }

  useEffect(() => {
    if (!open) return
    setSignIn(signin)
  }, [signin, open])

  return (
    <>
      <Dialog open={open} onClose={onClose} fullScreen>
        <div className="flex w-screen h-screen">
          {/* left side image */}
          <div
            className={clsx(
              'hidden md:block xl:min-w-[650px] min-w-[480px] h-full',
              'transition-all bg-cover bg-center bg-no-repeat',
              isSignIn ? 'bg-[url(/images/i2.png)]' : 'bg-[url(/images/i1.png)]'
            )}
          ></div>
          {/* right side misc */}
          <div className="flex-1 flex flex-col justify-center md:block items-center overflow-hidden">
            {/* close button */}
            <IconButton
              className={clsx(
                'flex justify-center items-center',
                'absolute md:relative top-4 left-4 !w-[50px] !h-[50px]',
                'md:!m-[49px] !m-4'
              )}
              style={{ border: '1px solid gray' }}
              onClick={onClose}
            >
              <MdOutlineArrowBackIosNew size={24} />
            </IconButton>
            {/* logo */}
            <div className="w-[418px] mx-auto md:ml-[187px] flex flex-col items-center">
              <Image
                width={418}
                height={91}
                src={
                  isDark ? '/images/logos/white.png' : '/images/logos/black.png'
                }
                alt="satoshilogo"
              ></Image>
              <div className="text-[28px] mt-4 md:mt-0 leading-[39px]">
                {isSignIn ? t('login.tosignin') : t('login.tosignup')}
              </div>
            </div>
            {/* form */}
            <div className="w-[418px] mx-auto md:ml-[187px] flex flex-col">
              {/* validate result */}
              <div className="mt-[29px] mb-[17px]">
                {validateErr
                  ? validateErr.map((item, index) => (
                      <div className="leading-[23px]" key={index}>
                        <span className="text-blue-500 mr-1">●</span>
                        <span className="text-red-500">{item}</span>
                      </div>
                    ))
                  : ''}
              </div>
              {/* email input form */}
              <div>
                <div className="py-[3px] text-xl">{t('email')}</div>
                <OutlinedInput
                  placeholder={t('login.placeholder-email')}
                  classes={{ root: 'w-full h-[50px] !rounded-[10px]' }}
                  onKeyUp={accountKeyDown}
                  autoFocus={autoFocus}
                  defaultValue={userEmail}
                  onChange={({ target }) => setUserEmail(target.value)}
                />
              </div>
              {/* password input form */}
              <div className="mt-10">
                <div className="py-[3px] text-xl">
                  {isSignIn ? (
                    <div className="flex justify-between items-center">
                      <div>{t('password')}</div>
                      <Link
                        classes={{
                          root: '!text-[18px] !text-black !decoration-black dark:!decoration-gray-300',
                        }}
                        className="cursor-pointer dark:!text-gray-300"
                        onClick={forgotPassword}
                      >
                        {t('forgot')}?
                      </Link>
                    </div>
                  ) : (
                    <div>{t('password')}</div>
                  )}
                </div>
                {/* Password input */}
                <OutlinedInput
                  placeholder={t('login.placeholder-password')}
                  classes={{ root: 'w-full h-[50px] !rounded-[10px]' }}
                  inputRef={pswRef}
                  type={showPwd ? 'text' : 'password'}
                  onChange={({ target }) => setUserPassword(target.value)}
                  onKeyUp={passwordKeyDown}
                  endAdornment={
                    <IconButton onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </IconButton>
                  }
                />
              </div>
              <Button
                variant="contained"
                style={{ textTransform: 'none' }}
                classes={{
                  root: '!bg-black !rounded-[30px] h-[56px] !mt-[51px] !leading-[29px] !text-xl',
                }}
                onClick={goVerify}
                disabled={showLoading}
              >
                {showLoading ? (
                  <CircularProgress color="secondary"></CircularProgress>
                ) : (
                  <span>
                    {isSignIn
                      ? t('login.button-submit-signin')
                      : t('login.button-submit-signup')}
                  </span>
                )}
              </Button>
              {/* switch api */}
              <div className="flex gap-[9px] mt-[22px] justify-center">
                <span>
                  {isSignIn
                    ? t('login.newaccount')
                    : t('login.alreadyhaveaccount')}
                </span>
                <Link
                  classes={{
                    root: '!text-black !decoration-black dark:!decoration-gray-300',
                  }}
                  className="cursor-pointer dark:!text-gray-300"
                  onClick={() => setSignIn(!isSignIn)}
                >
                  {isSignIn ? t('login.tosignup') : t('login.tosignin')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog open={verifyDialog} onClose={() => setVerifyDialog(false)}>
        <div className="w-[418px] mx-auto flex items-center flex-col">
          <div className="md:text-3xl text-2xl text-center text-blue-800 font-extrabold my-6 px-6">
            One final step! We need to verify your email
          </div>
          <div className="px-3 text-center">
            Please check your inbox for verification code sent to
            <span className="ml-2 font-bold">{userEmail}</span>
          </div>
          <div className="mt-6">Enter code</div>
          <Input
            autoFocus
            onChange={({ target }) => setVerifyCode(target.value)}
          />
          {/* <Button
            variant="contained"
            classes={{
              root: '!bg-black h-[46px] w-[100px] !my-6',
            }}
            onClick={goSignUp}
          >
            Verify
          </Button> */}
        </div>
      </Dialog>
    </>
  )
}

export default LoginDialog
