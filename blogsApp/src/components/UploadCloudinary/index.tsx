import {
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@BLOGS/shared/src/cloudinary'
import classNames from 'classnames'
import { type FormikProps } from 'formik'
import { memoize } from 'lodash'
import { useRef, useState, useCallback } from 'react'
import { trpc } from '../../lib/trpc'
import { Button, Buttons } from '../Button'
import s from './index.module.scss'

export const useUpload = (type: CloudinaryUploadTypeName) => {
  const prepareUpload = trpc.prepareUpload.useMutation()

  const getPrepareData = useCallback(
    memoize(
      async () => {
        const { preparedData } = await prepareUpload.mutateAsync({ type })
        return preparedData
      },
      () => JSON.stringify({ type, minutes: new Date().getMinutes() })
    ),
    [type]
  )

  const upload = async (file: File) => {
    const preparedData = await getPrepareData()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('timestamp', preparedData.timestamp)
    formData.append('folder', preparedData.folder)
    formData.append('api_key', preparedData.apiKey)
    formData.append('transformation', preparedData.transformation)
    formData.append('eager', preparedData.eager)
    formData.append('signature', preparedData.signature)

    // eslint-disable-next-line no-undef
    return await fetch(preparedData.url, {
      method: 'POST',
      body: formData,
    })
      .then(async (rawRes) => {
        return await rawRes.json()
      })
      .then((res) => {
        if (res.eror) {
          throw new Error(res.error.message)
        }

        return { publicId: res.public_id as string, res }
      })
  }

  return { upload }
}

export const Upload = <TTypeName extends CloudinaryUploadTypeName>({
  label,
  name,
  formik,
  type,
  preset,
}: {
  label: string
  name: string
  formik: FormikProps<any>
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const { upload } = useUpload(type)

  return (
    <div className={classNames({ [s.field]: true, [s.disabled]: disabled })}>
      <input
        className={s.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true)
            try {
              if (files?.length) {
                const file = files[0]
                const { publicId } = await upload(file)
                void formik.setFieldValue(name, publicId)
              }
            } catch (err: any) {
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
        <div className={s.previewPlace}>
          <img className={s.preview} alt="" src={getCloudinaryUploadUrl(value, type, preset)} />
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
            {value ? 'Загрузить другое' : 'Загрузить'}
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
              Удалить
            </Button>
          )}
        </Buttons>
      </div>
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
