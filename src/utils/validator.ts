import { t } from 'i18next'

export const validator = {
  checkEmail(email: string) {
    const isValid = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)
    if (!email.trim()) return t('not-null')
    if (!isValid) return t('invalid')

    return isValid
  },
  checkVerifyCode(verifyCode: string) {
    const isValid = /^\d{4}$/.test(verifyCode)

    if (!verifyCode.trim()) return t('not-null')
    if (!isValid) return t('invalid')

    return isValid
  },
  checkPassword(password: string) {
    // const isValid = /^\d{6,}$/.test(password)
    const isValid = password.length >= 6

    if (!password.trim()) return t('not-null')
    if (!isValid) return t('invalid')

    return isValid
  },
}
