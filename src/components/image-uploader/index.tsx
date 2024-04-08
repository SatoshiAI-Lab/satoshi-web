import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { IoAddSharp } from 'react-icons/io5'
import ReactCrop from 'react-image-crop'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import 'react-image-crop/dist/ReactCrop.css'
import { t } from 'i18next'
import { nanoid } from 'nanoid'

import { DialogHeader } from '../dialog-header'
import { fixedSize, useImageUploader } from './hooks/use-image-uploader'

const ImageUploader = () => {
  const imgRef = useRef<HTMLImageElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useRef('')
  const {
    src,
    open,
    crop,
    resultSrc,
    isNotValid,
    setFile,
    setCrop,
    cancelCrop,
    confirmCrop,
  } = useImageUploader(imgRef)

  const onUpload = () => {
    if (!inputRef.current) return
    // Clear input when each upload file,
    // if not clear, when you upload same file,
    // `onChange` event will not be called.
    inputRef.current.value = ''
  }

  useEffect(() => {
    // Use random id, otherwise if multiple creat token,
    // only first one will be trigger.
    inputId.current = nanoid()
  }, [])

  return (
    <>
      <Dialog open={isNotValid} onClose={cancelCrop}>
        <DialogHeader text={t('crop-size-error')} onClose={cancelCrop} />
        <DialogContent>
          {t('crop.error-message').split('$')[0]}
          <br />
          {t('crop.error-message').split('$')[1].replace('{}', '500 * 500')}
        </DialogContent>
      </Dialog>

      <Dialog
        open={open}
        classes={{
          paper: clsx(
            '!min-w-[500px] !min-h-[500px] !p-4',
            '!max-w-[90vw] !max-w-[90vh]'
          ),
        }}
      >
        <DialogHeader text={t('crop.title')} onClose={cancelCrop} />
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1 / 1}
          minWidth={fixedSize.width}
          minHeight={fixedSize.height}
          maxWidth={fixedSize.width}
          maxHeight={fixedSize.height}
        >
          <img ref={imgRef} src={src} alt="image" />
        </ReactCrop>
        <DialogActions classes={{ root: '!justify-center !mt-4' }}>
          <Button variant="contained" onClick={confirmCrop}>
            {t('confirm-crop')}
          </Button>
          <Button variant="outlined" onClick={cancelCrop}>
            {t('cancel-crop')}
          </Button>
        </DialogActions>
      </Dialog>

      <label
        className={clsx(
          'w-32 h-32',
          'border border-gray-400 rounded relative',
          'flex justify-center items-center cursor-pointer'
        )}
        htmlFor={inputId.current}
        onClick={onUpload}
      >
        <IoAddSharp className="h-3/4 w-3/4 text-gray-400 cursor-pointer" />
        {/* Result iamge */}
        {resultSrc && (
          <img src={resultSrc} alt="image" className="absolute inset-0" />
        )}
        <input
          ref={inputRef}
          type="file"
          id={inputId.current}
          className="w-0 h-0"
          accept="image/*"
          multiple={false}
          onChange={({ target }) => {
            if (!target.files) return
            setFile(target.files[0])
          }}
        />
      </label>
    </>
  )
}

export default ImageUploader
