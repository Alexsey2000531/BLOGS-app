import { zCreatePostTrpcInput } from '@BLOGS/backend/src/router/posts/createPost/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const CreatePostPage = wrapperPage({
  authorizedOnly: true,
})(() => {
  const createPost = trpc.createPost.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validationSchema: zCreatePostTrpcInput,
    onSubmit: async (values) => {
      await createPost.mutateAsync(values)
      formik.resetForm()
    },
    successMessage: 'Пост создан!',
    showValidationAlert: true,
  })

  return (
    <Segment title="Создать пост">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="name" label="Имя" formik={formik} />
          <Input name="nick" label="Никнейм" formik={formik} />
          <Input name="description" label="Описание" formik={formik} maxWidth={500} />
          <Textarea name="text" label="Текст" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Создать пост!</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
