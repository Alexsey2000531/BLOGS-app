/* eslint-disable no-undef */
import { getS3UploadUrl, getS3UploadName } from '@BLOGS/shared/src/s3'
import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Button, Buttons } from '../Button'
import s from './index.module.scss'

export const useUploadToS3 = (type: 'avatar' | 'image') => {
  const prepareS3Upload = trpc.prepareS3Upload.useMutation()
  const updateFileUrl = trpc.updateFile.useMutation()

  const uploadToS3 = async (file: File) => {
    const { signedUrl, s3Key } = await prepareS3Upload.mutateAsync({
      type: type,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })

    console.info('Uploading to:', signedUrl) // Логируем URL
    console.info('File size:', file.size)

    const headers = {
      'Content-Type': file.type,
      'Content-Length': file.size.toString(),
      Origin: window.location.origin,
      'x-amz-acl': 'public-read',
    }

    try {
      const response = await fetch(signedUrl, {
        method: 'PUT',
        headers,
        body: file,
        mode: 'cors',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', response.status, errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      } else {
        const { fileUrl } = await updateFileUrl.mutateAsync({ fileKey: s3Key, type })
        console.info(fileUrl)
      }

      return { s3Key }
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  return { uploadToS3 }
}

export const UploadToS3 = ({
  label,
  name,
  formik,
  type,
}: {
  label: string
  name: string
  formik: FormikProps<any>
  type: 'avatar' | 'image'
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToS3 } = useUploadToS3(type)

  return (
    <div className={cn({ [s.field]: true, [s.disabled]: disabled })}>
      <input
        className={s.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="*"
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true)
            try {
              if (files?.length) {
                const file = files[0]
                const { s3Key } = await uploadToS3(file)
                void formik.setFieldValue(name, s3Key)
              }
            } catch (err: any) {
              console.error(err)
              formik.setFieldError(name, err.message)
            } finally {
              void formik.setFieldTouched(name, true, false)
              setLoading(false)
              if (inputEl.current) {
                inputEl.current.value = ''
              }
            }
          })()
        }}
      />
      <label className={s.label} htmlFor={name}>
        {label}
      </label>
      {!!value && !loading && (
        <div className={s.uploads}>
          <div className={s.upload}>
            <a className={s.uploadLink} target="_blank" href={getS3UploadUrl(value)} rel="noreferrer">
              {getS3UploadName(value)}
            </a>
          </div>
        </div>
      )}
      <div className={s.buttons}>
        <Buttons>
          <Button
            type="button"
            onClick={() => inputEl.current?.click()}
            loading={loading}
            disabled={loading || disabled}
            color="green"
          >
            {value ? 'Upload another' : 'Upload'}
          </Button>
          {!!value && !loading && (
            <Button
              type="button"
              color="red"
              onClick={() => {
                void formik.setFieldValue(name, null)
                formik.setFieldError(name, undefined)
                void formik.setFieldTouched(name)
              }}
              disabled={disabled}
            >
              Remove
            </Button>
          )}
        </Buttons>
      </div>
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
