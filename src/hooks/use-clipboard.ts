import { t } from 'i18next'
import toast from 'react-hot-toast'

interface UseClipboardReturn {
  copy: (content: string) => Promise<boolean>
}

/**
 * Clipboard hook.
 */
export const useClipboard: () => UseClipboardReturn = () => {
  // TODO: adaption low version browser,
  // low version browser will not support navigator.clipboard
  async function copy(content: string) {
    try {
      await navigator.clipboard.writeText(content)
      toast.success(t('copy-success'))
      return true
    } catch (error) {
      toast.error(t('copy-failed'))
      return false
    }
  }

  return {
    copy,
  }
}
