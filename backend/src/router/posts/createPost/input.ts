import { z } from 'zod'
import { zNickRequired, zStringMin, zStringRequired } from '@BLOGS/shared/src/zod'

export const zCreatePostTrpcInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  description: zStringMin(5).max(100, 'Максимальное кол-во символов 100'),
  text: zStringMin(100),
  certificate: z.string().nullable(),
  images: z.array(zStringRequired),
})
