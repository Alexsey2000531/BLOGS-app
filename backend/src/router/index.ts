import { trpc } from '../lib/trpc'
import { createPostTrpcRoute } from './createPost'

// @index('./**/index.ts', f => `import {${f.path.split('/').slice(0, -1).pop()}TrpcRoute} from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getPostTrpcRoute } from './getPost'
import { getPostsTrpcRoute } from './getPosts'
// @endindex

export const trpcRouter = trpc.router({
  getPosts: getPostsTrpcRoute,
  getPost: getPostTrpcRoute,
  createPost: createPostTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
