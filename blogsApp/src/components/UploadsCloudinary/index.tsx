import {
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@BLOGS/shared/src/cloudinary'
import classnames from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { Button } from '../Button'
import { useUpload } from '../UploadCloudinary'
import { Icon } from '../icon'
import s from './index.module.scss'

export const UploadsCloudinary = <TTypeName extends CloudinaryUploadTypeName>({
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
  const value = formik.values[name] as string[]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { upload } = useUpload(type)

  return (
    <div className={classnames({ [s.field]: true, [s.disabled]: disabled })}>
      <input
        className={s.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
        multiple
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true)
            try {
              if (files?.length) {
                const newValue = [...value]
                await Promise.all(
                  Array.from(files).map(async (file) => {
                    await upload(file).then(({ publicId }) => {
                      newValue.push(publicId)
                    })
                  })
                )
                void formik.setFieldValue(name, newValue)
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
      {!!value?.length && (
        <div className={s.previews}>
          {value.map((publicId) => (
            <div key={publicId} className={s.previewPlace}>
              <button
                type="button"
                className={s.delete}
                onClick={() => {
                  void formik.setFieldValue(
                    name,
                    value.filter((deletedPublicId) => deletedPublicId !== publicId)
                  )
                }}
              >
                <Icon className={s.deleteIcon} name="deleteIcon" />
              </button>
              <img className={s.preview} alt="" src={getCloudinaryUploadUrl(publicId, type, preset)} />
            </div>
          ))}
        </div>
      )}
      <div className={s.buttons}>
        <Button
          type="button"
          onClick={() => inputEl.current?.click()}
          loading={loading}
          disabled={loading || disabled}
          color="green"
        >
          {value?.length ? 'Загрузить ещё' : 'Загрузить'}
        </Button>
      </div>
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
