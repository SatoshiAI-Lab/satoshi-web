/**
 * `LcoalStorage` and `SessionStorage` hook
 * @param useSessionStorage Use sessionStorage if true.
 */
export const useStorage = (useSessionStorage = false) => {
  const withNs = (moduleName: string) => `satoshiai::${moduleName}`

  // Get a storage.
  const get = (key: string) => {
    const k = withNs(key)
    return useSessionStorage
      ? sessionStorage.getItem(k)
      : localStorage.getItem(k)
  }

  // Add a storage.
  const set = (key: string, val: string) => {
    const k = withNs(key)
    return useSessionStorage
      ? sessionStorage.setItem(k, val)
      : localStorage.setItem(k, val)
  }

  // Remove storage from key.
  const remove = (key: string) => {
    const k = withNs(key)

    useSessionStorage
      ? sessionStorage.removeItem(k)
      : localStorage.removeItem(k)
  }

  // Remove all stored.
  const removeAll = () => {
    useSessionStorage ? sessionStorage.clear() : localStorage.clear()
  }

  return {
    // General API.
    get,
    set,
    remove,
    removeAll,

    // Language related.
    getLang: () => get('lang'),
    setLang: (val: string) => set('lang', val),

    // Live2D model related.
    getIsMuted: () => get('model_is_muted'),
    setIsMuted: (val: string) => set('model_is_muted', val),
  }
}
