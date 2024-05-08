import { useTokenCustomData } from './use-token-custom-data'

const regexp =
  /message|text|<blank.*?\/>|<pct-change.*?>.*?<\/pct-change>|link/g

/**
 * Handle chat response's `hyper_text` field.
 */
export const useHypertext = () => {
  const { setTokenData, setPercentData, setLinkData } = useTokenCustomData()

  const parse = (text?: string) => {
    if (!text) return ''

    const parsed = text.replace(regexp, ($1) => {
      const isMessage = $1 === 'message'
      if (isMessage) {
        return `div ${setTokenData()}`
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

        return `<span ${setPercentData(percent)}>${percent}</span>`
      }

      const isLink = $1 === 'link'
      if (isLink) {
        return `a ${setLinkData()}`
      }

      return ''
    })

    const removeTab = parsed.replace(/\s+(<p>)/g, () => '<p>')
    return removeTab
  }

  return {
    parse,
  }
}
