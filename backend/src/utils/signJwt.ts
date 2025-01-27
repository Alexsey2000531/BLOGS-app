import jwt from 'jsonwebtoken'
import { env } from '../lib/env'

export const signJwt = (userId: string): string => {
  return jwt.sign(userId, env.JWT_SECRET)
}
