import { zGetPostsTrpcInput } from '@BLOGS/backend/src/router/posts/getPosts/input'
import { CardActions, CircularProgress, IconButton, TextField, Menu, MenuItem } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { useDebounceValue } from 'usehooks-ts'
import s from './index.module.scss'
import MoreVertIcon from '../../../assets/images/more.png'
import { Alert } from '../../../components/Alert'
import { BlockPost } from '../../../components/BlockPost'
import { useForm } from '../../../lib/form'
import { wrapperPage } from '../../../lib/pageWrapper'
import { getViewPostRoute } from '../../../lib/routes'
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
  const [isOpen, setIsOpen] = useState<null | HTMLElement>(null)
  const [search, setSearch] = useDebounceValue(formik.values.search, 500)
  const open = Boolean(isOpen)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(event?.currentTarget)
  }

  const handleClose = () => {
    setIsOpen(null)
  }

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
            .map((post) => (
              <Card className={s.card} key={post.nick} sx={{ marginBottom: 2 }}>
                <CardHeader
                  className={s.header}
                  title={<Link to={getViewPostRoute({ postNick: post.nick })}>{post.name}</Link>}
                  subheader={`Дата публикации: ${format(post.createdAt, 'dd.MM.yyyy')}`}
                  action={
                    me?.permissions?.includes('ALL') ? (
                      <div>
                        <IconButton
                          aria-label="Ещё"
                          aria-controls="post-actions-menu"
                          onClick={(event) => {
                            handleClick(event)
                          }}
                          aria-haspopup="true"
                        >
                          <img src={MoreVertIcon} alt="Ещё" />
                        </IconButton>
                        <Menu
                          id="post-actions-menu"
                          open={open}
                          onClick={() => handleClose()}
                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                          }}
                        >
                          <MenuItem>
                            <BlockPost post={post} />
                          </MenuItem>
                        </Menu>
                      </div>
                    ) : null
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {`Лайков: ${post.likesCount} | Дизлайков: ${post.disLikesCount} | Комментариев: ${post.commentsCount}`}
                </CardActions>
              </Card>
            ))}
        </InfiniteScroll>
      )}
    </div>
  )
})
