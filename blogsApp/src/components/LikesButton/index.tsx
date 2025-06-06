import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { trpc } from '../../lib/trpc'
import { Icon } from '../icon'
import s from './index.module.scss'
import { mixpanelPostLikes } from '../../lib/mixpanel'

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
        void setLikePost
          .mutateAsync({ postId: post.id, isLikedByMe: !post.isLikedByMe })
          .then(({ post: { isLikedByMe } }) => {
            if (isLikedByMe) {
              mixpanelPostLikes(post)
            }
          })
      }}
    >
      {post.isLikedByMe ? <Icon size={24} name="likeFilled" /> : <Icon size={24} name="likeEmpty" />}
    </button>
  )
}
