import { canEditPost } from '@BLOGS/backend/src/utils/canBlockedPost'
import { getS3UploadName, getS3UploadUrl } from '@BLOGS/shared/src/s3'
import { format } from 'date-fns'
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
      <div className={s.text} dangerouslySetInnerHTML={{ __html: post?.text }} />
      <div className={s.info}>
        <div className={s.author}>
          Автор: {post.author.nick}
          {post.author.name ? `(${post.author.name})` : ''}
        </div>
        <div className={s.date}>Дата публикации: {format(post.createdAt, 'dd.MM.yyyy')}</div>
      </div>
      {post.certificate && (
        <div className={s.certificate}>
          Certificate:{' '}
          <a className={s.certificateLink} target="_blank" href={getS3UploadUrl(post.certificate)}>
            {getS3UploadName(post.certificate)}
          </a>
        </div>
      )}
      <CommentsList postNick={post.nick} />
      <div className={s.postInfo}>
        <div className={s.formComments}>{me && <Comment postId={post.id} authorId={me.id} />}</div>
        <div className={s.content_info}>
          <div className={s.likes}>
            {me && (
              <>
                <br />
                <LikeButton post={post} />
              </>
            )}
            <p>Лайков: {post.likeCount}</p>
          </div>
          <div className={s.disLikes}>
            {me && (
              <>
                <br />
                <DisLikeButton post={post} />
              </>
            )}
            <p>Дизлайков: {post.disLikeCount}</p>
          </div>
        </div>
      </div>
      {canEditPost(me, post) && (
        <div className={s.editPost}>
          <LinkButton to={getEditPostRoute({ postNick: post.nick })}>Редактировать пост</LinkButton>
        </div>
      )}
    </Segment>
  )
})
