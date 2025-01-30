import { zUpdateProfileInput } from '@BLOGS/backend/src/router/auth/updateProfile/Input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const ProfilePage = wrapperPage({
  authorizedOnly: true,
  setProps: ({ ctx }) => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      me: ctx.me!,
    }
  },
})(({ me }) => {
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
    <Segment title={`Редактировать профиль: ${me.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Никнейм" name="nick" formik={formik} />
          <Input label="Имя" name="name" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Редактировать профиль!</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
