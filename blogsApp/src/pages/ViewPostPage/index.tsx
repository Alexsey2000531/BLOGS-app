import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Segment } from '../../components/Segment'
import { type ViewPostRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const ViewPostPage = () => {
  const { postNick } = useParams() as ViewPostRouteParams
  const { data, error, isError, isFetching, isLoading } = trpc.getPost.useQuery({
    postNick,
  })

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data.post) {
    return <h1>Post not found!</h1>
  }

  return (
    <Segment title={data.post?.name} description={data.post?.description}>
      <div className={s.text} dangerouslySetInnerHTML={{ __html: data.post?.text }} />
      <div className={s.date}>Пост создан: {format(data.post.createdAt, 'dd/MM/yyyy')}</div>
    </Segment>
  )
}
