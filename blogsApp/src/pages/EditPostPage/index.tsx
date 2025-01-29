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
import { wrapperPage } from '../../lib/pageWrapper'
import { type EditPostRouteParams, getViewPostRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditPostPage = wrapperPage({
  authorizedOnly: true,
  useQuery: () => {
    const { postNick } = useParams() as EditPostRouteParams
    return trpc.getPost.useQuery({
      postNick,
    })
  },
  checkExists: ({ queryResult }) => !!queryResult.data.post,
  checkExistsMessage: 'Пост не найден',
  checkAccess: ({ queryResult, ctx }) => !!ctx.me && ctx.me.id === queryResult.data.post?.authorId,
  checkAccessMessage: 'Идею может редактировать только автор!',
  setProps: ({ queryResult }) => ({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    post: queryResult.data.post!,
  }),
})(({ post }) => {
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
})
