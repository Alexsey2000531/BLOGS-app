import { zSignUpTrpcInput } from '@BLOGS/backend/src/router/auth/signUp/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@BLOGS/shared/src/zod'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getSignInRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const SignUpPage = wrapperPage({
  redirectAuthorized: true,
  title: 'Регистрация',
})(() => {
  const trpcUtils = trpc.useContext()
  const signUp = trpc.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })
  return (
    <form className={s.form} onSubmit={formik.handleSubmit}>
      <h1 className={s.title}>Регистрация</h1>
      <FormItems>
        <Input name="nick" label="Никнейм" formik={formik} />
        <Input name="email" label="E-mail" formik={formik} />
        <Input name="password" label="Пароль" type="password" formik={formik} />
        <Input name="passwordAgain" label="Повторите пароль" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Зарегистрироваться!
        </Button>
        <Link className={s.link} to={getSignInRoute()}>
          Войти
        </Link>
      </FormItems>
    </form>
  )
})
