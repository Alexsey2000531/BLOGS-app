import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { zEditPostTrpcInput } from '@BLOGS/backend/src/router/EditPost/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import pick from 'lodash/pick'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { type EditPostRouteParams, getViewPostRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditPostComponent = ({ post }: { post: NonNullable<TrpcRouterOutput['getPost']['post']> }) => {
  const navigate = useNavigate()
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const editPost = trpc.EditPost.useMutation()
  const formik = useFormik({
    initialValues: pick(post, ['name', 'nick', 'description', 'text']),
    validate: withZodSchema(zEditPostTrpcInput.omit({ PostId: true })),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        await editPost.mutateAsync({ PostId: post.id, ...values })
        void navigate(getViewPostRoute({ postNick: values.nick }))
      } catch (err: any) {
        setSubmittingError(err.message)
      }
    },
  })

  return (
    <Segment title={`Редактировать пост: ${post.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Заголовок" name="name" formik={formik} />
          <Input label="Краткое описание" name="description" maxWidth={500} formik={formik} />
          <Textarea label="Описание" name="text" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Некоторые поля не валидны!</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Редактировать пост</Button>
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
