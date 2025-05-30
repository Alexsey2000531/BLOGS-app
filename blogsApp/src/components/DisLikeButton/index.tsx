import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { trpc } from '../../lib/trpc'
import { Icon } from '../icon'
import s from './index.module.scss'
import { mixpanelPostDisLike } from '../../lib/mixpanel'

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
        void setDisLikePost
          .mutateAsync({ postId: post.id, isDisLikedByMe: !post.isDisLikedByMe })
          .then(({ post: { isDisLikedByMe } }) => {
            if (isDisLikedByMe) {
              mixpanelPostDisLike(post)
            }
          })
      }}
    >
      {post.isDisLikedByMe ? <Icon size={24} name="dislikeFilled" /> : <Icon size={24} name="dislikeEmpty" />}
    </button>
  )
}
