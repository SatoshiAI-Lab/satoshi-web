import { camelCase } from 'lodash'

const defaultSetValue = 'true'
const defaultGetValue = {} as Record<string, any>

/**
 * Only used for token relate chat.
 */
export const useTokenCustomData = () => {
  const prefix = (name: string) => `data-${name}`

  const set = (key: string) => {
    /** Default set "true" string. */
    return (value = defaultSetValue) => `${key}="${value}"`
  }

  const get = (name: string) => {
    /** Default use null object. */
    return (props = defaultGetValue) => props[camelCase(name)]
  }

  const tokenAttr = prefix('is-token-el')
  const percentAttr = prefix('is-percent-el')
  const linkAttr = prefix('is-link-el')
  const refAttr = prefix('is-reference-el')

  return {
    tokenAttr,
    getTokenData: get(tokenAttr),
    setTokenData: set(tokenAttr),

    percentAttr,
    getPercentData: get(percentAttr),
    setPercentData: set(percentAttr),

    linkAttr,
    getLinkData: get(linkAttr),
    setLinkData: set(linkAttr),

    refAttr,
    getRefData: get(refAttr),
    setRefData: set(refAttr),
  }
}
