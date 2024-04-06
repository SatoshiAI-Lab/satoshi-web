import { Html, Head, Main, NextScript } from 'next/document'

import { URL_CONFIG } from '@/config/url'

export default function Document() {
  const baseURL = `${URL_CONFIG.cdn}/live2d/js`

  return (
    <Html lang="en" className="dark">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
      <script src={`${baseURL}/live2d_cubism_core.min.js`}></script>
      <script src={`${baseURL}/live2d.min.js`}></script>
      <script src={`${baseURL}/pixi.min.js`}></script>
      <script src={`${baseURL}/pixi_live2d_display.min.js`}></script>
    </Html>
  )
}
