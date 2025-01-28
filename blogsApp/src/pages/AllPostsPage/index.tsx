import { title } from 'process'
import { Link } from 'react-router-dom'
import { Segment } from '../../components/Segment'
import { getViewPostRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import s from './index.module.scss'

export const AllPostsPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getPosts.useQuery()

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <Segment title="Все посты">
      <div className={s.posts}>
        {data.posts.map((post) => (
          <div className={s.post} key={post.nick}>
            <Segment description={post.description} size={2} title={title} />
            <Link className={s.postLink} to={getViewPostRoute({ postNick: post.nick })}>
              {post.name}
            </Link>
          </div>
        ))}
      </div>
    </Segment>
  )
}
