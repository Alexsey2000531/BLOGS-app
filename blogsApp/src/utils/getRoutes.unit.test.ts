/* eslint-disable no-undef */
process.env.WEBAPP_URL = 'https://example.com'

import { gtr } from './getRoutes'

describe('gtr', () => {
  it('возвращает маленькие роуты', () => {
    const getSimpleRoute = gtr(() => '/simple')
    expect(getSimpleRoute()).toBe('/simple')
  })

  it('возвращает роут с параметрами', () => {
    const getWithParamsRoute = gtr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute({ param1: 'xxx', param2: 'yyy' })).toBe('/a/xxx/b/yyy/c')
  })

  it('возвращает обратный роут', () => {
    const getWithParamsRoute = gtr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute.definition).toBe('/a/:param1/b/:param2/c')
  })

  it('возвращает роут placeholders', () => {
    const getWithParamsRoute = gtr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute.placeholders).toMatchObject({ param1: ':param1', param2: ':param2' })
  })

  it('возвращает абсолютный роут', () => {
    const getSimpleRoute = gtr(() => '/simple')
    expect(getSimpleRoute({ abs: true })).toBe('https://example.com/simple')
  })
})
