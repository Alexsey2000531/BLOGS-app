import { zCreatePostTrpcInput } from '@BLOGS/backend/src/router/createPost/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { trpc } from '../../lib/trpc'

export const CreatePostPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const createPost = trpc.createPost.useMutation()
  const formik = useFormik({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate: withZodSchema(zCreatePostTrpcInput),
    onSubmit: async (values) => {
      try {
        await createPost.mutateAsync(values)
        formik.resetForm()
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (error: any) {
        setSubmittingError(error.message)
        setTimeout(() => {
          setSubmittingError(null)
        }, 3000)
      }
    },
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
          {!formik.isValid && !!formik.submitCount && (
            <div style={{ color: 'red', marginBottom: 10 }}>Некоторые поля не валидны</div>
          )}
          {!!submittingError && <Alert color="red">{submittingError}</Alert>}
          {successMessageVisible && <Alert color="green">Пост создан!</Alert>}
          <Button loading={formik.isSubmitting}>Создать пост!</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
