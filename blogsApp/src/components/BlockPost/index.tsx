import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { useForm } from '../../lib/form'
import { trpc } from '../../lib/trpc'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { FormItems } from '../FormItems'

export const BlockPost = ({ post }: { post: NonNullable<TrpcRouterOutput['getPost']['post']> }) => {
  const blockPost = trpc.blockPost.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, buttonProps, alertProps } = useForm({
    onSubmit: async () => {
      await blockPost.mutateAsync({ postId: post.id })
      await trpcUtils.getPost.refetch({ postNick: post.nick })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Блокировать пост
        </Button>
      </FormItems>
    </form>
  )
}
