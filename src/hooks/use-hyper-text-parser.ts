/**
 * parse chatApi `hyper_text` from RegExp, it does not render.
 * @param reg A RegExp.
 * @returns Return a tuple, include a parser function.
 */
export const useHyperTextParser = (reg: RegExp) => {
  function parser(str: string) {
    const parsed = str.replace(reg, ($1) => {
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

  return [parser]
}
