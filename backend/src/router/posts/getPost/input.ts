import { z } from 'zod'
import { zStringRequired } from '@BLOGS/shared/dist/zod.js'

export const zGetPostInputTrpc = z.object({
  postNick: zStringRequired,
})
