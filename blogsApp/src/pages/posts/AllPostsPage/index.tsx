import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { getViewPostRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import s from './index.module.scss'

export const AllPostsPage = () => {
  const { data, error, isLoading, isFetching, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getPosts.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
    )

  if (isLoading || isFetching) {
    return <Loader type="page" />
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <Segment title="Все посты">
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error}</Alert>
      ) : (
        <div className={s.posts}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={s.more} key="loader">
                <Loader type="section" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
          >
            {data.pages
              .flatMap((page) => page.posts)
              .map((post) => (
                <div className={s.post} key={post.nick}>
                  <Segment
                    size={2}
                    title={
                      <Link className={s.postLink} to={getViewPostRoute({ postNick: post.nick })}>
                        {post.name}
                      </Link>
                    }
                    description={post.description}
                  />
                </div>
              ))}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
}
