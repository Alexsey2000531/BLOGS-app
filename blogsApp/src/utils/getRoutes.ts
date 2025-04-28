/* eslint-disable no-redeclare */
import { useParams as useReactRouterParams } from 'react-router-dom'

type getRouteInputBase = {
  abs?: boolean
}

function getRoutes<T extends Record<string, boolean>>(
  // eslint-disable-next-line no-unused-vars
  routeParamsDefinition: T,
  // eslint-disable-next-line no-unused-vars
  getRoutes: (routeParams: Record<keyof T, string>) => string
): {
  // eslint-disable-next-line no-unused-vars
  (routeParams: Record<keyof T, string> & getRouteInputBase): string
  placeholders: Record<keyof T, string>
  useParams: () => Record<keyof T, string>
  definition: string
}

// eslint-disable-next-line no-unused-vars
function getRoutes(getRoutes: () => string): {
  // eslint-disable-next-line no-unused-vars
  (routeParams?: getRouteInputBase): string
  placeholders: {}
  useParams: () => {}
  definition: string
}

function getRoutes(routeParamsOrGetRoutes?: any, maybeGetRoutes?: any) {
  const routeParamsDefinition = typeof routeParamsOrGetRoutes === 'function' ? {} : routeParamsOrGetRoutes
  const getRoute = typeof routeParamsOrGetRoutes === 'function' ? routeParamsOrGetRoutes : maybeGetRoutes
  const placeholders = Object.keys(routeParamsDefinition).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
  const definition = getRoute(placeholders)
  const getedRoutes = (routeParams?: getRouteInputBase) => {
    const route = getRoute(routeParams)
    if (routeParams?.abs) {
      // eslint-disable-next-line no-undef
      return `${process.env.WEBAPP_URL}${route}`
    } else {
      return route
    }
  }

  getedRoutes.placeholders = placeholders
  getedRoutes.definition = definition
  getedRoutes.useParams = useReactRouterParams as any
  return getedRoutes
}

export const gtr = getRoutes
