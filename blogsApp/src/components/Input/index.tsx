import cn from 'classnames'
import { type FormikProps } from 'formik'
import s from './index.module.scss'

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  placeholder,
  type = 'text',
}: {
  name: string
  label?: string
  formik: FormikProps<any>
  maxWidth?: number | string
  placeholder?: string
  type?: 'text' | 'password'
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const disabled = formik.isSubmitting
  const invalid = !!touched && !!error

  return (
    <div className={cn({ [s.field]: true, [s.disabled]: disabled })} style={{ marginBottom: 10 }}>
      <label className={s.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={cn({ [s.input]: true, [s.invalid]: invalid })}
        style={{ maxWidth }}
        placeholder={placeholder}
        type={type}
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        disabled={formik.isSubmitting}
        value={value}
        name={name}
        id={name}
      />
      {invalid && <div className={s.error}>{error}</div>}
    </div>
  )
}
