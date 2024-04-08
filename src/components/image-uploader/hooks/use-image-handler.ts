import type { Crop } from 'react-image-crop'

import { utilParse } from '@/utils/parse'

export const useImageHandler = () => {
  const fileToBase64Src = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      const error = (e: ProgressEvent<FileReader>) => {
        return reject(`[convertToBase64 Error]: ${e}`)
      }

      reader.readAsDataURL(file)
      reader.addEventListener('error', error)
      reader.addEventListener('loadend', async (e) => {
        if (!reader.result) return error(e)
        if (typeof reader.result === 'string') {
          resolve(reader.result)
          return
        }

        resolve(utilParse.bufferToBase64(reader.result))
      })
    })
  }

  const createImg = (src: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()

      img.src = src
      img.addEventListener('error', (e) => reject(`[createImg Error]: ${e}`))
      img.addEventListener('load', () => resolve(img))
    })
  }

  const getCroppedCanvas = (img: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    const pixelRatio = window.devicePixelRatio
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio
    ctx.imageSmoothingQuality = 'high'
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return canvas
  }

  return {
    createImg,
    fileToBase64Src,
    getCroppedCanvas,
  }
}
