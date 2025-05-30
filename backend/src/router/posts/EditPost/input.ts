import { zCreatePostTrpcInput } from '../createPost/input'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zEditPostTrpcInput = zCreatePostTrpcInput.extend({
  PostId: zStringRequired,
})
