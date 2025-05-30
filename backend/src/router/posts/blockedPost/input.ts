import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zBlockedPostInput = z.object({
  postId: zStringRequired,
})
