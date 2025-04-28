import { zGetPostsTrpcInput } from '@BLOGS/backend/src/router/posts/getPosts/input'
import { getAvatarUrl } from '@BLOGS/shared/src/cloudinary'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { CircularProgress, TextField } from '@mui/material'
import { Card, Menu, Dropdown } from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { useDebounceValue } from 'usehooks-ts'
import s from './index.module.scss'
import { Alert } from '../../../components/Alert'
import { BlockPost } from '../../../components/BlockPost'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getEditPostRoute, getViewPostRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const AllPostsPage = wrapperPage({
  title: 'BLOGS APP',
  isTitleExact: true,
  setProps: ({ ctx }) => ({
    me: ctx.me,
  }),
})(({ me }) => {
  const { formik } = useForm({
    initialValues: {
      search: '',
    },
    validationSchema: zGetPostsTrpcInput.pick({ search: true }),
  })

  const [openedPostNick, setOpenedPostNick] = useState<string | null>(null)
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
    return <CircularProgress />
  }

  if (isError) {
    return <Alert color="red">{error.message}</Alert>
  }

  return (
    <div>
      <TextField
        fullWidth
        label="Поиск"
        name="search"
        value={formik.values.search}
        onChange={formik.handleChange}
        sx={{ marginBottom: 2 }}
      />
      {isLoading || isRefetching ? (
        <CircularProgress />
      ) : isError ? (
        <Alert color="red">{error}</Alert>
      ) : !data.pages[0].posts?.length ? (
        <Alert color="brown">Ничего не найдено по поиску!</Alert>
      ) : (
        <InfiniteScroll
          className={s.container}
          threshold={250}
          loadMore={() => {
            if (!isFetchingNextPage && hasNextPage) {
              void fetchNextPage()
            }
          }}
          hasMore={hasNextPage}
          loader={
            <div key="loader">
              <CircularProgress />
            </div>
          }
        >
          {data.pages
            .flatMap((page) => page.posts)
            .map((post) => {
              const isCurrentOpen = openedPostNick === post.nick

              const handleClick = () => {
                setOpenedPostNick(post.nick)
              }

              const handleClose = () => {
                setOpenedPostNick(null)
              }

              const menu = (
                <Menu onClick={handleClose}>
                  <Menu.Item key="block">
                    <BlockPost post={post} />
                  </Menu.Item>
                </Menu>
              )
              return (
                <Card
                  className={s.card}
                  key={post.nick}
                  style={{ marginBottom: 16 }}
                  actions={[
                    <Link to={getEditPostRoute({ postNick: post.nick })}>
                      <EditOutlined key="edit" />
                    </Link>,
                    me?.permissions?.includes('ALL') && (
                      <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        open={isCurrentOpen}
                        onOpenChange={(visible) => {
                          if (visible) {
                            handleClick()
                          } else {
                            handleClose()
                          }
                        }}
                      >
                        <EllipsisOutlined style={{ fontSize: '18px', cursor: 'pointer' }}></EllipsisOutlined>
                      </Dropdown>
                    ),
                  ].filter(Boolean)}
                >
                  <Card.Meta
                    className={s.cardMeta}
                    avatar={
                      post.author?.avatar ? (
                        <img
                          className={s.cardMetaAvatar}
                          src={getAvatarUrl(post.author?.avatar, 'small')}
                          alt="avatar"
                        />
                      ) : (
                        <img className={s.cardMetaAvatar} src={getAvatarUrl(null, 'small')} alt="avatar" />
                      )
                    }
                    title={<Link to={getViewPostRoute({ postNick: post.nick })}>{post.name}</Link>}
                    description={`Опубликовано: ${format(post.createdAt, 'dd.MM.yyyy')}`}
                  />
                  <div className={s.cardContent}>
                    <p>{post.description}</p>
                  </div>
                  <div className={s.cardStats}>
                    <span>❤️ {post.likesCount}</span>
                    <span>👎 {post.disLikesCount}</span>
                    <span>💬 {post.commentsCount}</span>
                  </div>
                </Card>
              )
            })}
        </InfiniteScroll>
      )}
    </div>
  )
})
