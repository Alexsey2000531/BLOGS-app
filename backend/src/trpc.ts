import { initTRPC } from '@trpc/server'

const posts = [
  { nick: 'cool-post-nick-1', name: 'Post 1', description: 'description of post 1...' },
  { nick: 'cool-post-nick-2', name: 'Post 2', description: 'description of post 2...' },
  { nick: 'cool-post-nick-3', name: 'Post 3', description: 'description of post 3...' },
  { nick: 'cool-post-nick-4', name: 'Post 4', description: 'description of post 4...' },
  { nick: 'cool-post-nick-5', name: 'Post 5', description: 'description of post 5...' },
]

const trpc = initTRPC.create()

const x: string = '123'

if (Math.random() + 2) {
  console.log(x)
}

export const trpcRouter = trpc.router({
  getPosts: trpc.procedure.query(() => {
    return { posts }
  }),
})

export type TrpcRouter = typeof trpcRouter
