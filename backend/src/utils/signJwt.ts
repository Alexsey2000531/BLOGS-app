import jwt from 'jsonwebtoken'

export const signJwt = (userId: string): string => {
  return jwt.sign(userId, 'не совсем секретный ключ-jwt')
}
