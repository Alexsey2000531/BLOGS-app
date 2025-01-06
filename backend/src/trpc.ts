import { initTRPC } from '@trpc/server'
import _ from 'lodash'
import { z } from 'zod'

const posts = _.times(100, (i) => ({
  nick: `cool-idea-nick-${i + 1}`,
  name: `Posts ${i + 1}`,
  description: `Description of post ${i + 1}...`,
  text: _.times(100, (j) => `<p>Text paragraph ${j} of post ${i + 1}...</p>`).join(''),
}))

const trpc = initTRPC.create()

export const trpcRouter = trpc.router({
  getPosts: trpc.procedure.query(() => {
    return { posts: posts.map((post) => _.pick(post, ['nick', 'name', 'description'])) }
  }),
  getPost: trpc.procedure
    .input(
      z.object({
        postNick: z.string(),
      })
    )
    .query(({ input }) => {
      const post = posts.find((post) => input.postNick === post.nick)
      return { post: post || null }
    }),
})

export type TrpcRouter = typeof trpcRouter
