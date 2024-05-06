import { CHAT_CONFIG } from '@/config/chat'

/**
 * Parse chat response's `hyper_text` from `RegExp`.
 */
export const useHypertext = () => {
  return (text?: string) => {
    if (!text) return ''

    const parsed = text.replace(CHAT_CONFIG.hypertextRule, ($1) => {
      const isMessage = $1 === 'message'
      if (isMessage) {
        return 'div data-token-tag'
      }

      const isText = $1 === 'text'
      if (isText) {
        return 'span'
      }

      const isBlank = $1.match(/blank/)
      if (isBlank) {
        const breakLine = $1.match(/\d+/g)
        const [x, y] = breakLine ?? [0, 0]
        return `<span style="display: inline-block; width: ${x}px; height: ${y}px"></span>`
      }

      const isPctChange = $1.match(/pct-change/)
      if (isPctChange) {
        const percent = $1.match(/<pct-change>(.*?)<\/pct-change>/)?.[1]

        return `<span data-percent-tag=\"${percent}\">${percent}</span>`
      }

      const isLink = $1 === 'link'
      if (isLink) {
        return `a`
      }

      return ''
    })

    const removeTab = parsed.replace(/\s+(<p>)/g, () => '<p>')
    return removeTab
  }
}
