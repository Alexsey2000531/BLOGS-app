const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllPostsRoute = () => '/'

export const viewPostRouteParams = getRouteParams({ postNick: true })
export type ViewPostRouteParams = typeof viewPostRouteParams
export const getViewPostRoute = ({ postNick }: ViewPostRouteParams) => `/posts/${postNick}`

export const editPostRouteParams = getRouteParams({ postNick: true })
export type EditPostRouteParams = typeof editPostRouteParams
export const getEditPostRoute = ({ postNick }: EditPostRouteParams) => `/posts/${postNick}/edit`

export const getCreatePostRoute = () => '/posts/new'

export const updateProfileRoute = () => '/update-profile'

export const signUpRoute = () => '/sign-up'

export const signInRoute = () => '/sign-in'

export const signOutRoute = () => '/sign-out'
