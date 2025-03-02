import { zSignInTrpcRoute } from '@BLOGS/backend/src/router/auth/signIn/Input'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { signUpRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const SignInPage = wrapperPage({
  redirectAuthorized: true,
  title: 'Вход',
})(() => {
  const trpcUtils = trpc.useContext()
  const signUp = trpc.signIn.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
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
    <form className={s.form} onSubmit={formik.handleSubmit}>
      <h1 className={s.title}>Вход</h1>
      <FormItems>
        <Input name="nick" label="Никнейм" formik={formik} />
        <Input name="email" label="E-mail" formik={formik} />
        <Input name="password" label="Пароль" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button color="blue" {...buttonProps}>
          Авторизироваться
        </Button>
        <Link className={s.link} to={signUpRoute()}>
          Нет аккаунта?
        </Link>
      </FormItems>
    </form>
  )
})
