import { useEffect, useState } from 'react'

import { useImageHandler } from './use-image-handler'

import type { Crop } from 'react-image-crop'

export const fixedSize = {
  width: 500,
  height: 500,
}

export const useImageUploader = (imgRef: React.RefObject<HTMLImageElement>) => {
  const [src, setSrc] = useState('')
  const [file, setFile] = useState<File>()
  const [crop, setCrop] = useState<Crop>()
  const [resultSrc, setResultSrc] = useState('')
  const [isNotValid, setIsNotValid] = useState(false)
  const { fileToBase64Src, createImg, getCroppedCanvas } = useImageHandler()

  const confirmCrop = () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return

    const canvas = getCroppedCanvas(imgRef.current, crop)
    const src = canvas?.toDataURL('image/png') ?? ''

    setResultSrc(src)
    cancelCrop()
  }

  const cancelCrop = () => {
    setSrc('')
    setFile(undefined)
    setCrop(undefined)
    setIsNotValid(false)
  }

  const isValidSize = () => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const src = await fileToBase64Src(file!)
        const img = await createImg(src)
        const validWidth = img.width >= fixedSize.width
        const validHeight = img.height >= fixedSize.height

        resolve(validWidth && validHeight)
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleUploadedFile = async () => {
    const isValid = await isValidSize()

    setIsNotValid(!isValid)
    if (!isValid) return

    URL.revokeObjectURL(src)
    setSrc(URL.createObjectURL(file!))
  }

  useEffect(() => {
    if (!file) return

    handleUploadedFile()
  }, [file])

  return {
    src,
    file,
    crop,
    open: !!src.trim(),
    resultSrc,
    isNotValid,
    setSrc,
    setFile,
    setCrop,
    confirmCrop,
    cancelCrop,
  }
}
