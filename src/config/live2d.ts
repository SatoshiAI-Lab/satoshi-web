/**
 * Management Live2D config.
 */
export const LIVE2D_CONFIG = {
  /** model.json file path */
  modelPath: '/live2d/satoshi/model.json',

  /** model.json Sounds audios i18n replace key. */
  audioLangKey: '{lang}',

  /** PC config */
  desktop: {
    scale: 0.134,
    config: {
      x: -110,
      y: -50,
    },
  },
  /** Mobile config */
  mobile: {
    scale: 0.1,
    config: {
      x: -170,
      y: 200,
    },
  },
  /** Mobile vitural keyboard show config */
  mobileKeyboarShow: {
    x: -170,
    y: 450,
  },
}
