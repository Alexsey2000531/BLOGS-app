import { canEditPost } from '@BLOGS/backend/src/utils/canBlockedPost'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@BLOGS/shared/src/cloudinary'
import { format } from 'date-fns'
import ImageGallery from 'react-image-gallery'
import s from './index.module.scss'
import { LinkButton } from '../../../components/Button'
import { Comment } from '../../../components/Comment'
import { CommentsList } from '../../../components/CommentList'
import { DisLikeButton } from '../../../components/DisLikeButton'
import { LikeButton } from '../../../components/LikesButton'
import { Segment } from '../../../components/Segment'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getEditPostRoute, getViewPostRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const ViewPostPage = wrapperPage({
  useQuery: () => {
    const { postNick } = getViewPostRoute.useParams()
    return trpc.getPost.useQuery({
      postNick,
    })
  },
  setProps: ({ queryResult, ctx, checkExists }) => ({
    post: checkExists(queryResult.data.post, 'Пост не найден!'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ post }) => post.name,
})(({ post, me }) => {
  return (
    <Segment title={'Мой пост'} description={post?.description}>
      <article className={s.content}>
        <div className={s.text} dangerouslySetInnerHTML={{ __html: post?.text }} />
      </article>
      <div className={s.postHeader}>
        <div className={s.authorInfo}>
          <img className={s.avatar} alt="avatar" src={getAvatarUrl(post.author.avatar, 'small')} />
          <div className={s.meta}>
            <span className={s.authorName}>
              {post.author.nick || post.author.name}
              {post.author.name && <span className={s.nickName}>@{post.author.name}</span>}
            </span>
            <span className={s.date}>Дата публикации: {format(post.createdAt, 'dd.MM.yyyy')}</span>
          </div>
        </div>

        {canEditPost(me, post) && (
          <div className={s.editPost}>
            <LinkButton to={getEditPostRoute({ postNick: post.nick })}>Редактировать пост</LinkButton>
          </div>
        )}
      </div>

      {!!post.images.length && (
        <div className={s.galleryWrapper}>
          <ImageGallery
            showPlayButton={false}
            showFullscreenButton={false}
            items={post.images.map((image) => ({
              original: getCloudinaryUploadUrl(image, 'image', 'large'),
              thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
            }))}
            additionalClass={s.gallery}
          />
        </div>
      )}

      <div className={s.postInfo}>
        <div className={s.reactions}>
          <div className={s.reaction}>
            {me && <LikeButton post={post} />}
            <span className={s.reactionCount}>{post.likeCount}</span>
          </div>
          <div className={s.reaction}>
            {me && <DisLikeButton post={post} />}
            <span className={s.reactionCount}>{post.disLikeCount}</span>
          </div>
        </div>
      </div>

      <div className={s.commentsSection}>
        <h3 className={s.commentsTitle}>Комментарии</h3>
        <CommentsList postNick={post.nick} />
        {me && (
          <div className={s.commentForm}>
            <Comment postId={post.id} authorId={me.id} />
          </div>
        )}
      </div>
    </Segment>
  )
})
