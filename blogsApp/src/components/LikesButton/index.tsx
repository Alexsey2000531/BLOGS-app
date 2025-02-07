import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { trpc } from '../../lib/trpc'
import { Icon } from '../icon'
import s from './index.module.scss'

export const LikeButton = ({ post }: { post: NonNullable<TrpcRouterOutput['getPost']['post']> }) => {
  const trpcUtils = trpc.useContext()
  const setLikePost = trpc.setLikePost.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetPostData = trpcUtils.getPost.getData({ postNick: post.nick })
      if (oldGetPostData?.post) {
        const newGetPostData = {
          ...oldGetPostData,
          post: {
            ...oldGetPostData.post,
            isLikedByMe,
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            likeCount: oldGetPostData.post.likeCount + (isLikedByMe ? 1 : -1),
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
      className={s.likeButton}
      onClick={() => {
        void setLikePost.mutateAsync({ postId: post.id, isLikedByMe: !post.isLikedByMe })
      }}
    >
      {post.isLikedByMe ? <Icon size={24} name="likeFilled" /> : <Icon size={24} name="likeEmpty" />}
    </button>
  )
}
