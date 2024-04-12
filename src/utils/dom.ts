export const utilDom = {
  /**
   * Scroll to element bottom.
   * @param el target element.
   * @param delay optional delay scroll time. default: 100ms.
   */
  scrollToBottom(el: HTMLElement, delay = 100, smooth = true) {
    if (!el) return

    el.style.scrollBehavior = smooth ? 'smooth' : 'auto'
    setTimeout(() => {
      el.scrollTo(0, el.scrollHeight)
      el.style.scrollBehavior = 'auto'
    }, delay)
  },

  /**
   * Find `target element` on `origin element` click.
   * @param origin clicked element.
   * @param target target element.
   * @param suspendEl Final target element.
   * @returns Return a object, contains whether found and found element.
   */
  eventProxy(origin: HTMLElement, target: string, suspendEl = 'body') {
    target = target.toUpperCase()
    suspendEl = suspendEl.toLocaleUpperCase()

    while (
      origin &&
      origin.tagName !== target &&
      origin.tagName !== suspendEl
    ) {
      ;(origin as HTMLElement | null) = origin.parentElement
    }

    return {
      isTarget: origin && origin.tagName !== suspendEl,
      targetEl: origin,
    }
  },
}
