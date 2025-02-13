import { trpc } from '../../lib/trpc'
import { zCreateCommentsTrpcInput } from '@BLOGS/backend/src/router/posts/createComments/input'
import { Button } from '../Button'
import { Input } from '../Input'
import { useForm } from '../../lib/form'
import s from './index.module.scss'
import { Alert } from '../Alert'

export const Comment = ({ postId, authorId }: { postId: string; authorId: string }) => {
  const commentsTrpc = trpc.addComments.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      postId,
      authorId,
      content: '',
    },
    validationSchema: zCreateCommentsTrpcInput,
    onSubmit: async (values) => {
      await commentsTrpc.mutate({ postId, authorId, content: values.content })
    },
    successMessage: 'Комментарий успешно добавлен!',
    resetOnSuccess: true,
    showValidationAlert: true,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <div className={s.comments}>
        <Input name="content" label="Комментарий" formik={formik} placeholder="Напишите комментарий..." />
        <Button color="green" {...buttonProps}>
          {formik.isSubmitting ? 'Отправка...' : 'Отправить'}
        </Button>
        <Alert {...alertProps} />
      </div>
    </form>
  )
}
