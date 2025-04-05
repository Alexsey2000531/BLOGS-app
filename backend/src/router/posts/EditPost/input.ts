import { zCreatePostTrpcInput } from '../createPost/input'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zEditPostTrpcInput = zCreatePostTrpcInput.extend({
  PostId: zStringRequired,
})
