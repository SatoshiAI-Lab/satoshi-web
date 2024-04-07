import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { IoAddSharp } from 'react-icons/io5'

// TODO: waiting for implementation.
const FileUploader = () => {
  const [files, setFiles] = useState<FileList | null>(null)

  useEffect(() => {
    console.log('files', files)
  }, [files])

  return (
    <label
      className={clsx(
        'border border-gray-400 rounded w-32 h-32',
        'flex justify-center items-center cursor-pointer'
      )}
      htmlFor="upload"
    >
      <IoAddSharp className="h-3/4 w-3/4 text-gray-400 cursor-pointer" />
      <input
        type="file"
        id="upload"
        className="w-0 h-0"
        onChange={(e) => setFiles(e.target.files)}
      />
    </label>
  )
}

export default FileUploader
