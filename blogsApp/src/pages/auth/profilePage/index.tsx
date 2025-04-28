import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { zUpdatePasswordInput } from '@BLOGS/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileInput } from '@BLOGS/backend/src/router/auth/updateProfile/Input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@BLOGS/shared/src/zod'
import { Link } from 'react-router-dom'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Upload } from '../../../components/UploadCloudinary'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getSignOutRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useContext()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
      avatar: me.avatar,
    },
    validationSchema: zUpdateProfileInput,
    onSubmit: async (values) => {
      const updateMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updateMe! })
      formik.setValues(
        {
          nick: '',
          name: '',
          avatar: '',
        },
        false
      )
    },
    successMessage: 'Профиль обновлён!',
    resetOnSuccess: false,
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <div className={s.center}>
          <Input label="Никнейм" name="nick" formik={formik} />
          <Input label="Имя" name="name" formik={formik} />
          <Upload label="Аватар" name="avatar" formik={formik} type="avatar" preset="small" />
          <Alert {...alertProps} />
        </div>
        <div className={s.button}>
          <Button color="green" {...buttonProps}>
            Изменить данные
          </Button>
        </div>
      </FormItems>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordInput
      .extend({
        newPasswordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')),
    onSubmit: async ({ newPassword, currentPassword }) => {
      await updatePassword.mutateAsync({ newPassword, currentPassword })
    },
    successMessage: 'Пароль изменён!',
    resetOnSuccess: true,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <div className={s.center}>
          <Input label="Старый пароль" name="currentPassword" type="password" formik={formik} />
          <Input label="Новый пароль" name="newPassword" type="password" formik={formik} />
          <Input label="Повторите новый пароль" name="newPasswordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
        </div>
        <div className={s.button}>
          <Button color="green" {...buttonProps}>
            Изменить пароль
          </Button>
        </div>
      </FormItems>
    </form>
  )
}

export const ProfilePage = wrapperPage({
  authorizedOnly: true,
  title: 'Профиль',
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  return (
    <div className={s.profile}>
      <General me={me} />
      <Password />
      <Link className={s.link} to={getSignOutRoute()}>
        Выйти
      </Link>
    </div>
  )
})
