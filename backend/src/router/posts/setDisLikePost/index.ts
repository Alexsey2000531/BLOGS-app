import { trpc } from '../../../lib/trpc'
import { zSetDisLikePostInput } from './input'

export const setDisLikePostTrpcRoute = trpc.procedure.input(zSetDisLikePostInput).mutation(async ({ input, ctx }) => {
  const { postId, isDisLikedByMe } = input
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

  // если пользователь ставит дизлайк
  if (zSetDisLikePostInput) {
    // удаляем лайк, если он стоит
    await ctx.prisma.like.deleteMany({
      where: {
        postId,
        authorId: ctx.me.id,
      },
    })

    // ставим дтзлайк на пост
    await ctx.prisma.disLike.upsert({
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
    // если пользователь убирает дизлайк, удаляем его
    await ctx.prisma.disLike.delete({
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
      isDisLikedByMe,
    },
  }
})
