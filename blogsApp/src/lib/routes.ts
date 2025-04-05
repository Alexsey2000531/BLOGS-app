import { gtr } from '../utils/getRoutes'

export const getAllPostsRoute = gtr(() => '/')

export const getViewPostRoute = gtr({ postNick: true }, ({ postNick }) => `/posts/${postNick}`)
export const getEditPostRoute = gtr({ postNick: true }, ({ postNick }) => `/posts/${postNick}/edit`)

export const getCreatePostRoute = gtr(() => '/posts/new')

export const getUpdateProfileRoute = gtr(() => '/update-profile')

export const getSignUpRoute = gtr(() => '/sign-up')

export const getSignInRoute = gtr(() => '/sign-in')

export const getSignOutRoute = gtr(() => '/sign-out')
