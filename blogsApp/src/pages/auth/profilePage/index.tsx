import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { zUpdatePasswordInput } from '@BLOGS/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileInput } from '@BLOGS/backend/src/router/auth/updateProfile/Input'
import { z } from 'zod'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useContext()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
    },
    validationSchema: zUpdateProfileInput,
    onSubmit: async (values) => {
      const updateMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updateMe })
    },
    successMessage: 'Профиль обновлён!',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Никнейм" name="nick" formik={formik} />
        <Input label="Имя" name="name" formik={formik} />
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Редактировать профиль!
        </Button>
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
        newPasswordAgain: z.string().min(8),
      })
      .superRefine((val, ctx) => {
        if (val.newPassword !== val.newPasswordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Пароли должны быть одинаковы!',
            path: ['newPasswordAgain'],
          })
        }
      }),
    onSubmit: async ({ newPassword, currentPassword }) => {
      await updatePassword.mutateAsync({ newPassword, currentPassword })
    },
    successMessage: 'Пароль изменён!',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Старый пароль" name="currentPassword" type="password" formik={formik} />
        <Input label="Новый пароль" name="newPassword" type="password" formik={formik} />
        <Input label="Повторите новый пароль" name="newPasswordAgain" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Изменить пароль!</Button>
      </FormItems>
    </form>
  )
}

export const ProfilePage = wrapperPage({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
})(({ me }) => {
  return (
    <>
      <Segment title={`Редактировать профиль: ${me.nick}`}>
        <Segment title="Общие" size={2}>
          <General me={me} />
        </Segment>
        <Segment title="Пароль" size={2}>
          <Password />
        </Segment>
      </Segment>
    </>
  )
})
