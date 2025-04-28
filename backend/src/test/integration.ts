import '../lib/sentry.mock'
import { type Post, type User } from '@prisma/client'
import { omit } from '@BLOGS/shared/src/omit'
import { createAppContext } from '../lib/ctx'
import { getTrpcContext } from '../lib/trpc'
import { trpcRouter } from '../router'
import { getPasswordHash } from '../utils/getPasswordHash'
import { type ExpressRequest } from '../utils/types'
import { logger } from '../lib/logger'
import { randomUUID } from 'crypto'
import { env } from '../lib/env'

if (env.NODE_ENV !== 'test') {
  throw new Error('Запуск интеграционных тестов только с NODE_ENV=test')
}

export const appContext = createAppContext()

afterAll(appContext.stop)

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }))
}

export const createUser = async ({ user = {} }: { user?: Partial<User> } = {}) => {
  try {
    const idSuffix = randomUUID().slice(0, 8)
    return await appContext.prisma.user.create({
      data: {
        nick: user.nick ?? `user${idSuffix}`,
        email: user.email ?? `user${idSuffix}@example.com`,
        password: getPasswordHash(user.password || '1234'),
        ...omit(user, ['password']),
      },
    })
  } catch (err) {
    logger.error({ logType: 'failed to create user', error: err })
    throw err
  }
}

export const createPost = async ({ post = {}, author }: { post?: Partial<Post>; author: Pick<User, 'id'> }) => {
  try {
    const idSuffix = randomUUID().slice(0, 8)
    return await appContext.prisma.post.create({
      data: {
        nick: post.nick ?? `post${idSuffix}`,
        authorId: author.id,
        name: post.name ?? `Post ${idSuffix}`,
        description: post.description ?? `Post ${idSuffix} description`,
        text: post.text ?? `Post ${idSuffix} text text text text text text text text text text text`,
        images: post.images ?? [],
        ...post,
      },
    })
  } catch (err) {
    logger.error({ logType: 'failed to create post', error: err })
    throw err
  }
}

export const createPostWithAuthor = async ({
  author,
  post,
}: { author?: Partial<User>; post?: Partial<Post>; number?: number } = {}) => {
  const createdUser = await createUser({ user: author })

  if (!createdUser?.id) {
    throw new Error('createPostWithAuthor: failed to create user')
  }

  const createdPost = await createPost({ post, author: { id: createdUser.id } })

  if (!createdPost) {
    throw new Error('createPostWithAuthor: failed to create post')
  }

  return {
    author: createdUser,
    post: createdPost,
  }
}

export const createPostLike = async ({
  post,
  liker,
  createdAt,
}: {
  post: Pick<Post, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: Date
}) => {
  return await appContext.prisma.like.create({
    data: {
      postId: post.id,
      authorId: liker.id,
      createdAt,
    },
  })
}
