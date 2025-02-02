import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const DisLikeButton = ({ post }: { post: NonNullable<TrpcRouterOutput['getPost']['post']> }) => {
  const trpcUtils = trpc.useContext()
  const setDisLikePost = trpc.setDisLikePost.useMutation({
    onMutate: ({ isDisLikedByMe }) => {
      const oldGetPostData = trpcUtils.getPost.getData({ postNick: post.nick })
      if (oldGetPostData?.post) {
        const newGetPostData = {
          ...oldGetPostData,
          post: {
            ...oldGetPostData.post,
            isDisLikedByMe,
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            disLikesCount: oldGetPostData.post.disLikeCount + (isDisLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getPost.setData({ postNick: post.nick }, newGetPostData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getPost.invalidate({ postNick: post.nick })
    },
  })
  return (
    <button
      className={s.disLikeButton}
      onClick={() => {
        void setDisLikePost.mutateAsync({ postId: post.id, isDisLikedByMe: !post.isDisLikedByMe })
      }}
    >
      {post.isDisLikedByMe ? '' : 'Не нравится'}
    </button>
  )
}
