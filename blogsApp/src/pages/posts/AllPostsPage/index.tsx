import { zGetPostsTrpcInput } from '@BLOGS/backend/src/router/posts/getPosts/input'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { useDebounceValue } from 'usehooks-ts'
import { Alert } from '../../../components/Alert'
import { Input } from '../../../components/Input'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getViewPostRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import s from './index.module.scss'

export const AllPostsPage = wrapperPage({
  title: 'BLOGS APP',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: {
      search: '',
    },
    validationSchema: zGetPostsTrpcInput.pick({ search: true }),
  })
  const [search, setSearch] = useDebounceValue(formik.values.search, 500)

  useEffect(() => {
    setSearch(formik.values.search)
  }, [formik.values.search])

  const { data, error, isLoading, isFetching, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getPosts.useInfiniteQuery(
      {
        search,
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
      <div className={s.filter}>
        <Input maxWidth={'100%'} label="Поиск" name="search" formik={formik} />
      </div>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error}</Alert>
      ) : !data.pages[0].posts?.length ? (
        <Alert color="brown">Ничего не найдено по поиску!</Alert>
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
                  >
                    Лайков: {post.likesCount}
                    <br />
                    Дизлайков: {post.disLikesCount}
                  </Segment>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
})
