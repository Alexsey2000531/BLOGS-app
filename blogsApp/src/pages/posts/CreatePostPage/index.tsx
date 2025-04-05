import { zCreatePostTrpcInput } from '@BLOGS/backend/src/router/posts/createPost/input'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadToS3 } from '../../../components/UploadToS3/UploadToS3'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const CreatePostPage = wrapperPage({
  authorizedOnly: true,
  title: 'Новый пост',
})(() => {
  const createPost = trpc.createPost.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
      certificate: '',
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
    <form
      className={s.form}
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <h1 className={s.title}>Создать пост</h1>
      <FormItems>
        <Input name="name" label="Имя" formik={formik} />
        <Input name="nick" label="Никнейм" formik={formik} />
        <Input name="description" label="Описание" formik={formik} maxWidth={500} />
        <Textarea name="text" label="Текст" formik={formik} />
        <UploadToS3 type="image" label="Certificate" name="certificate" formik={formik} />
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Создать пост!
        </Button>
      </FormItems>
    </form>
  )
})
