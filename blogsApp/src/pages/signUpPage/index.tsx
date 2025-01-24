import { zSignUpTrpcInput } from '@BLOGS/backend/src/router/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { z } from 'zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { trpc } from '../../lib/trpc'

export const SignUpPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const signUp = trpc.signUp.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
        .extend({
          passwordAgain: z.string().min(1),
        })
        .superRefine((val, ctx) => {
          if (val.password !== val.passwordAgain) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Пароли должны быть одинаковыми!',
              path: ['passwordAgain'],
            })
          }
        })
    ),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        await signUp.mutateAsync(values)
        formik.resetForm()
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (err: any) {
        setSubmittingError(err.message)
      }
    },
  })

  return (
    <Segment title="Зарегистрироваться">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Никнейм" formik={formik} />
          <Input name="password" label="Пароль" formik={formik} />
          <Input name="passwordAgain" label="Повторите пароль" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Некоторые поля невалидны!</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          {successMessageVisible && <Alert color="green">Спасибо за регистрацию!</Alert>}
          <Button loading={formik.isSubmitting}>Зарегистрироваться</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
