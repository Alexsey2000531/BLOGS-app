import { z } from 'zod'
import { zStringOptional } from '@BLOGS/shared/dist/zod.js'

export const zGetPostsTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(10),
  search: zStringOptional,
})
