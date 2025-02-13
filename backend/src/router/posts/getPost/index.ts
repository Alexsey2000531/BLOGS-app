import _ from 'lodash'
import { z } from 'zod'
import { trpc } from '../../../lib/trpc'

export const getPostTrpcRoute = trpc.procedure
  .input(
    z.object({
      postNick: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const rawPost = await ctx.prisma.post.findUnique({
      where: {
        nick: input.postNick,
      },
      include: {
        Comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            nick: true,
            name: true,
          },
        },
        Like: {
          select: {
            id: true,
          },
          where: {
            authorId: ctx.me?.id,
          },
        },
        DisLike: {
          select: {
            id: true,
          },
          where: {
            authorId: ctx.me?.id,
          },
        },
        _count: {
          select: {
            Like: true,
            DisLike: true,
            Comments: true,
          },
        },
      },
    })

    if (rawPost?.blockedAt) {
      throw new Error('Этот пост заблокировал администратор!')
    }

    const isLikedByMe = !!rawPost?.Like.length
    const isDisLikedByMe = !!rawPost?.DisLike.length

    const likeCount = rawPost?._count.Like || 0
    const disLikeCount = rawPost?._count.DisLike || 0

    const commentsCount = rawPost?._count.Comments || 0

    const post = rawPost && {
      ..._.omit(rawPost, ['Like', 'DisLike', '_count']),
      Comments: rawPost.Comments,
      isLikedByMe,
      likeCount,
      isDisLikedByMe,
      disLikeCount,
      commentsCount,
    }

    return { post }
  })
