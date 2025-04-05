import { z } from 'zod'
import { zNickRequired, zEmailRequired, zStringRequired } from '@BLOGS/shared/src/zod'

export const zSignUpTrpcInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
