import { zEditPostTrpcInput } from '@BLOGS/backend/src/router/posts/EditPost/input'
import { canEditPost } from '@BLOGS/backend/src/utils/canBlockedPost'
import pick from 'lodash/pick'
import { useNavigate } from 'react-router-dom'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadToS3 } from '../../../components/UploadToS3/UploadToS3'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getEditPostRoute, getViewPostRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const EditPostPage = wrapperPage({
  authorizedOnly: true,
  useQuery: () => {
    const { postNick } = getEditPostRoute.useParams()
    return trpc.getPost.useQuery({
      postNick,
    })
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const post = checkExists(queryResult.data.post, 'Пост не найден!')
    checkAccess(canEditPost(ctx.me, post), 'Пост может редактировать только автор!')
    return {
      post,
    }
  },
  title: ({ post }) => `Редактировать пост "${post.name}"`,
})(({ post }) => {
  const navigate = useNavigate()
  const editPost = trpc.EditPost.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(post, ['name', 'nick', 'description', 'text', 'images', 'certificate']),
    validationSchema: zEditPostTrpcInput.omit({ PostId: true }),
    onSubmit: async (values) => {
      await editPost.mutateAsync({ PostId: post.id, ...values })
      void navigate(getViewPostRoute({ postNick: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <form className={s.form} onSubmit={formik.handleSubmit}>
      <h1 className={s.title}>Редактировать пост - {post.name}</h1>
      <FormItems>
        <Input label="Заголовок" name="name" formik={formik} />
        <Input label="Краткое описание" name="description" maxWidth={500} formik={formik} />
        <Textarea label="Описание" name="text" formik={formik} />
        <UploadToS3 type="image" label="Certificate" name="certificate" formik={formik} />
        <Alert {...alertProps} />
        <Button color="green" {...buttonProps}>
          Редактировать пост!
        </Button>
      </FormItems>
    </form>
  )
})
