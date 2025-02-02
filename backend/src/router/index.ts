import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTprcRoute } from './auth/updateProfile'
import { getEditPostTrpcRoute } from './posts/EditPost'
import { createPostTrpcRoute } from './posts/createPost'

// @index('./**/index.ts', f => `import {${f.path.split('/').slice(0, -1).pop()}TrpcRoute} from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getPostTrpcRoute } from './posts/getPost'
import { getPostsTrpcRoute } from './posts/getPosts'
import { setDisLikePostTrpcRoute } from './posts/setDisLikePost'
import { setLikePostTrpcRoute } from './posts/setLikePost'
// @endindex

export const trpcRouter = trpc.router({
  getPosts: getPostsTrpcRoute,
  getPost: getPostTrpcRoute,
  EditPost: getEditPostTrpcRoute,
  createPost: createPostTrpcRoute,
  getMe: getMeTrpcRoute,
  signUp: signUpTrpcRoute,
  signIn: signInTrpcRoute,
  updateProfile: updateProfileTprcRoute,
  updatePassword: updatePasswordTrpcRoute,
  setLikePost: setLikePostTrpcRoute,
  setDisLikePost: setDisLikePostTrpcRoute,
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
