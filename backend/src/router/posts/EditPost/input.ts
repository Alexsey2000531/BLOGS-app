import { z } from 'zod'
import { zCreatePostTrpcInput } from '../createPost/input'

export const zEditPostTrpcInput = zCreatePostTrpcInput.extend({
  PostId: z.string().min(1),
})
