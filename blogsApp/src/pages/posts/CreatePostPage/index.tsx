import { zCreatePostTrpcInput } from '@BLOGS/backend/src/router/posts/createPost/input'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadsCloudinary } from '../../../components/UploadsCloudinary'
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
      images: [],
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
        <UploadsCloudinary label="Изображение" name="images" formik={formik} type="image" preset="preview" />
        <Textarea name="text" label="Текст" formik={formik} />
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Создать пост!
        </Button>
      </FormItems>
    </form>
  )
})
