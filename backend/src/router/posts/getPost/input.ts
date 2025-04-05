import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/src/zod'

export const zGetPostInputTrpc = z.object({
  postNick: zStringRequired,
})
