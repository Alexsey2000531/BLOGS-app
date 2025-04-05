import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zBlockedPostInput = z.object({
  postId: zStringRequired,
})
