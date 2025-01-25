import { zSignInTrpcRoute } from '@BLOGS/backend/src/router/signIn/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const signUp = trpc.signIn.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcRoute),
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
    <Segment title="Войти">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Никнейм" formik={formik} />
          <Input name="password" label="Пароль" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Некоторые поля невалидны!</Alert>}
          {successMessageVisible && <Alert color="green">Добро пожаловать!</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Войти</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
