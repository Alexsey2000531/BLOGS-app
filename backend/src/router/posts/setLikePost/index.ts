import { trpc } from '../../../lib/trpc'
import { zSetLikePostInput } from './input'

export const setLikePostTrpcRoute = trpc.procedure.input(zSetLikePostInput).mutation(async ({ input, ctx }) => {
  const { postId, isLikedByMe } = input
  if (!ctx.me) {
    throw new Error('Не авторизован!')
  }

  const post = await ctx.prisma.post.findUnique({
    where: {
      id: postId,
    },
  })

  if (!post) {
    throw new Error('Не найдено!')
  }

  // если пользователь ставит лайк
  if (isLikedByMe) {
    // удаляем дизлайк, если он стоит
    await ctx.prisma.disLike.deleteMany({
      where: {
        postId,
        authorId: ctx.me.id,
      },
    })

    // ставим лайк на пост
    await ctx.prisma.like.upsert({
      where: {
        postId_authorId: {
          postId,
          authorId: ctx.me.id,
        },
      },
      create: {
        authorId: ctx.me.id,
        postId,
      },
      update: {},
    })
  } else {
    // если пользователь убирает лайк, удаляем его
    await ctx.prisma.like.delete({
      where: {
        postId_authorId: {
          postId,
          authorId: ctx.me.id,
        },
      },
    })
  }

  // получаем кол-во лайков и дизлайков
  const likeCount = await ctx.prisma.like.count({
    where: {
      postId,
    },
  })

  const disLikeCount = await ctx.prisma.disLike.count({
    where: {
      postId,
    },
  })

  return {
    post: {
      id: post.id,
      likeCount,
      disLikeCount,
      isLikedByMe,
    },
  }
})
