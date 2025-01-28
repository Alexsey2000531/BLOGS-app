import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { LinkButton } from '../../components/Button'
import { Segment } from '../../components/Segment'
import { getEditPostRoute, type ViewPostRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const ViewPostPage = () => {
  const { postNick } = useParams() as ViewPostRouteParams
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

  return (
    <Segment title={'Мой пост'} description={post?.description}>
      <div className={s.text} dangerouslySetInnerHTML={{ __html: post?.text }} />
      <div className={s.info}>
        <div className={s.author}>Автор: {post.author.nick}</div>
        <div className={s.date}>Дата публикации: {format(post.createdAt, 'dd.MM.yyyy')}</div>
      </div>
      {me?.id === post.authorId && (
        <div>
          <LinkButton to={getEditPostRoute({ postNick: post.nick })}>Редактировать пост</LinkButton>
        </div>
      )}
    </Segment>
  )
}
