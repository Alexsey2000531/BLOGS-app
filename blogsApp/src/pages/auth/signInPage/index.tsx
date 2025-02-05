import { zSignInTrpcRoute } from '@BLOGS/backend/src/router/auth/signIn/Input'
import Cookies from 'js-cookie'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const SignInPage = wrapperPage({
  redirectAuthorized: true,
})(() => {
  const trpcUtils = trpc.useContext()
  const signUp = trpc.signIn.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcRoute,
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Войти">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Никнейм" formik={formik} />
          <Input name="password" label="Пароль" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button color="green" {...buttonProps}>
            Войти
          </Button>
        </FormItems>
      </form>
    </Segment>
  )
})
