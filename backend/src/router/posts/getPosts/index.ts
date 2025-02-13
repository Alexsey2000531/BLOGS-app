import _ from 'lodash'
import { trpc } from '../../../lib/trpc'
import { zGetPostsTrpcInput } from './input'

export const getPostsTrpcRoute = trpc.procedure.input(zGetPostsTrpcInput).query(async ({ ctx, input }) => {
  const normalizedSearch = input.search
    ? input.search
        .trim()
        .split(/\s+/) // Разбиваем на слова
        .map((word) => `${word}:*`) // Добавляем поддержку частичного совпадения
        .join(' & ')
    : undefined
  const rawPosts = await ctx.prisma.post.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      createdAt: true,
      serialNumber: true,

      _count: {
        select: {
          Like: true,
          DisLike: true,
          Comments: true,
        },
      },
    },
    where: {
      blockedAt: null,
      ...(!normalizedSearch
        ? {}
        : {
            OR: [
              {
                name: {
                  search: normalizedSearch,
                },
              },
              {
                description: {
                  search: normalizedSearch,
                },
              },
              {
                text: {
                  search: normalizedSearch,
                },
              },
            ],
          }),
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextPost = rawPosts.at(input.limit)
  const nextCursor = nextPost?.serialNumber
  const rawPostsExceptNext = rawPosts.slice(0, input.limit)
  const postsExceptNext = rawPostsExceptNext.map((post) => ({
    ..._.omit(post, ['_count']),
    likesCount: post._count.Like,
    disLikesCount: post._count.DisLike,
    commentsCount: post._count.Comments,
  }))

  return { posts: postsExceptNext, nextCursor }
})
