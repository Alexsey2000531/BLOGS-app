import { posts } from '../../lib/posts'
import { trpc } from '../../lib/trpc'
import { zCreatePostTrpcInput } from './input'

export const createPostTrpcRoute = trpc.procedure.input(zCreatePostTrpcInput).mutation(({ input }) => {
  if (posts.find((post) => post.nick === input.nick)) {
    throw Error('Пост с таким Никнеймом уже существует!')
  }
  posts.unshift(input)
})
