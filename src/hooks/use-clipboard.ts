import { t } from 'i18next'
import toast from 'react-hot-toast'

interface UseClipboardReturn {
  copy: (content: string) => Promise<boolean>
}

/**
 * Clipboard hook. supported lower version browser.
 */
export const useClipboard: () => UseClipboardReturn = () => {
  const deprecatedCopy = (content: string) => {
    try {
      const textarea = document.createElement('textarea')

      textarea.value = content
      textarea.style.position = 'fixed'

      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)

      toast.success(t('copy-success'))
      return Promise.resolve(true)
    } catch (error) {
      toast.error(t('copy-failed') + error)
      return Promise.reject(false)
    }
  }

  const copy = async (content: string) => {
    try {
      // if users browser version is so low,
      // use `document.execCommand` to copy.
      if (!navigator.clipboard) return deprecatedCopy(content)

      await navigator.clipboard.writeText(content)
      toast.success(t('copy-success'))
      return true
    } catch (error) {
      toast.error(t('copy-failed') + error)
      return false
    }
  }

  return {
    copy,
  }
}
