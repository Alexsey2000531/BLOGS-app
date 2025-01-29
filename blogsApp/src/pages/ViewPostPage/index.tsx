import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { LinkButton } from '../../components/Button'
import { Segment } from '../../components/Segment'
import { wrapperPage } from '../../lib/pageWrapper'
import { getEditPostRoute, type ViewPostRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const ViewPostPage = wrapperPage({
  useQuery: () => {
    const { postNick } = useParams() as ViewPostRouteParams
    return trpc.getPost.useQuery({
      postNick,
    })
  },
  checkExists: ({ queryResult }) => !!queryResult.data.post,
  checkExistsMessage: 'Пост не найден',
  setProps: ({ queryResult, ctx }) => ({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    post: queryResult.data.post!,
    me: ctx.me,
  }),
})(({ post, me }) => {
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
})
