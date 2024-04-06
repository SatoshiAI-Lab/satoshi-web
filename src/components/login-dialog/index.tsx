import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Button,
  CircularProgress,
  Dialog,
  Input,
  Link,
  OutlinedInput,
} from '@mui/material'
import clsx from 'clsx'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useUserStore } from '@/stores/use-user-store'
import { LoginDialogProps } from './types'
import { validator } from '@/utils/validator'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useShow } from '@/hooks/use-show'

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

  const {
    show: showLoading,
    open: openLoading,
    hidden: closeLoading,
  } = useShow()

  const { t } = useTranslation()
  const { login, register, sendEmailVerify } = useUserStore()

  // TODO: add forgot password
  const forgotPassword = () => {
    console.log('forgot password')
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
              'hidden md:block xl:min-w-[650px]',
              'min-w-[480px] h-full transition-all bg-cover bg-center bg-no-repeat',
              (isSignIn && 'bg-[url(/images/i2.png)]') ||
                'bg-[url(/images/i1.png)]'
            )}
          ></div>
          {/* right side misc */}
          <div className="flex-1 flex flex-col justify-center md:block items-center overflow-hidden">
            {/* close button */}
            <button
              className="absolute md:relative top-4 left-4 w-[50px] h-[50px] flex justify-center items-center rounded-full border border-1 md:m-[49px] m-4"
              onClick={onClose}
            >
              <MdOutlineArrowBackIosNew size={24} />
            </button>
            {/* logo */}
            <div className="w-[418px] mx-auto md:ml-[187px] flex flex-col items-center">
              <Image
                width={418}
                height={91}
                src={'/images/logos/black.png'}
                alt="satoshilogo"
              ></Image>
              <div className="text-[#101010] text-[28px] mt-4 md:mt-0 leading-[39px]">
                {(isSignIn && <>{t('login.tosignin')}</>) || (
                  <>{t('login.tosignup')}</>
                )}
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
                        <span className="text-[#E2251B]">{item}</span>
                      </div>
                    ))
                  : ''}
              </div>
              {/* email input form */}
              <div>
                <div className="py-[3px] text-[#101010] text-xl">Email</div>
                <OutlinedInput
                  placeholder={t('login.placeholder-email')}
                  classes={{
                    root: 'w-full h-[50px] !rounded-[10px]',
                  }}
                  autoFocus={autoFocus}
                  defaultValue={userEmail}
                  onChange={({ target }) => setUserEmail(target.value)}
                />
              </div>
              {/* password input form */}
              <div className="mt-10">
                <div className="py-[3px] text-[#101010] text-xl">
                  {(isSignIn && (
                    <div className="flex justify-between items-center">
                      <div>Password</div>
                      <Link
                        classes={{
                          root: '!text-[18px] !text-black !decoration-black',
                        }}
                        className="cursor-pointer"
                        onClick={forgotPassword}
                      >
                        Forgot?
                      </Link>
                    </div>
                  )) || <div>Password</div>}
                </div>
                <OutlinedInput
                  placeholder={t('login.placeholder-password')}
                  classes={{
                    root: 'w-full h-[50px] !rounded-[10px]',
                  }}
                  type="password"
                  onChange={({ target }) => setUserPassword(target.value)}
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
                  {(isSignIn && t('login.newaccount')) ||
                    t('login.alreadyhaveaccount')}
                </span>
                <Link
                  classes={{
                    root: '!text-black !decoration-black',
                  }}
                  className="cursor-pointer"
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
