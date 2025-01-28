import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { zEditPostTrpcInput } from '@BLOGS/backend/src/router/EditPost/input'
import pick from 'lodash/pick'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { useForm } from '../../lib/form'
import { type EditPostRouteParams, getViewPostRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditPostComponent = ({ post }: { post: NonNullable<TrpcRouterOutput['getPost']['post']> }) => {
  const navigate = useNavigate()
  const editPost = trpc.EditPost.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(post, ['name', 'nick', 'description', 'text']),
    validationSchema: zEditPostTrpcInput.omit({ PostId: true }),
    onSubmit: async (values) => {
      await editPost.mutateAsync({ PostId: post.id, ...values })
      void navigate(getViewPostRoute({ postNick: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <Segment title={`Редактировать пост: ${post.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Заголовок" name="name" formik={formik} />
          <Input label="Краткое описание" name="description" maxWidth={500} formik={formik} />
          <Textarea label="Описание" name="text" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Редактировать пост!</Button>
        </FormItems>
      </form>
    </Segment>
  )
}

export const EditPostPage = () => {
  const { postNick } = useParams() as EditPostRouteParams
  const getPostResult = trpc.getPost.useQuery({
    postNick,
  })
  const getMeResult = trpc.getMe.useQuery()

  if (getPostResult.isLoading || getMeResult.isLoading || getPostResult.isFetching || getMeResult.isFetching) {
    return <span>Loading...</span>
  }

  if (getPostResult.isError) {
    return <span>Error: {getPostResult.error.message}</span>
  }

  if (getMeResult.isError) {
    return <span>Error: {getMeResult.error.message}</span>
  }

  if (!getPostResult.data.post) {
    return <h1>Post not found!</h1>
  }

  const post = getPostResult.data.post
  const me = getMeResult.data.me

  if (!me) {
    return <span>Только для авторизованных!</span>
  }

  if (me.id !== post.authorId) {
    return <span>Пост можно редактировать только автор</span>
  }

  return <EditPostComponent post={post} />
}
