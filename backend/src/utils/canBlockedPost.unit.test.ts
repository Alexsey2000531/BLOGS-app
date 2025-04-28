import { hasPermission, canEditPost } from './canBlockedPost'

describe('canBlockedPost', () => {
  it('hasPermission возвращает истину для пользователей с этим permission', () => {
    expect(hasPermission({ permissions: ['BLOCK_POST'], id: 'x' }, 'BLOCK_POST')).toBe(true)
  })

  it('hasPermission возвращает ложь для пользователей с этим permission', () => {
    expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_POST')).toBe(false)
  })

  it('hasPermission возвращает истину для пользователей с этим "ALL" permission', () => {
    expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_POST')).toBe(true)
  })

  it('только автор может редактировать свой пост', () => {
    expect(canEditPost({ permissions: [], id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditPost({ permissions: [], id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})
