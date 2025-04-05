import { zNickRequired, zEmailRequired, zStringRequired } from '@BLOGS/shared/src/zod'
import { z } from 'zod'

export const zSignInTrpcRoute = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
