import { z } from 'zod'
import { posts } from '../../lib/posts'
import { trpc } from '../../lib/trpc'

export const getPostTrpcRoute = trpc.procedure
  .input(
    z.object({
      postNick: z.string(),
    })
  )
  .query(({ input }) => {
    const post = posts.find((post) => input.postNick === post.nick)
    return { post: post || null }
  })
