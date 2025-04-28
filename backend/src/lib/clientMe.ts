import { type User } from '@prisma/client'
import { pick } from '@BLOGS/shared/src/pick'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['email', 'id', 'nick', 'name', 'permissions', 'avatar'])
}
