import { type UseTRPCQueryResult, type UseTRPCQuerySuccessResult } from '@trpc/react-query/shared'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useAppContext, type AppContext } from './ctx'
import { getAllPostsRoute } from './routes'
import { ErrorPageComponent } from '../components/ErrorPageComponent/index'
import { Loader } from '../components/Loader'
import { NotFoundPage } from '../pages/other/NotFoundPage'

class CheckExistsError extends Error {}
const checkExistsFn = <T,>(value: T, message?: string): NonNullable<T> => {
  if (!value) {
    throw new CheckExistsError(message)
  }
  return value
}

class CheckAccessError extends Error {}
const checkAccessFn = <T,>(value: T, message?: string): void => {
  if (!value) {
    throw new CheckAccessError(message)
  }
}

class GetAuthorizedMeError extends Error {}

type Props = Record<string, any>
type QueryResult = UseTRPCQueryResult<any, any>
type QuerySuccessResult<TQueryResult extends QueryResult> = UseTRPCQuerySuccessResult<
  NonNullable<TQueryResult['data']>,
  null
>
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: AppContext
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined
}
type setPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
  checkAccess: typeof checkAccessFn
  getAuthorizedMe: (message?: string) => NonNullable<AppContext['me']>
}
type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean

  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string

  checkAccess?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkAccessTitle?: string
  checkAccessMessage?: string

  checkExists?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string

  showLoaderOnFetching?: boolean

  title: string | ((titleProps: HelperProps<TQueryResult> & TProps) => string)
  isTitleExact?: boolean

  useQuery?: () => TQueryResult
  setProps?: (setProps: setPropsProps<TQueryResult>) => TProps
  Page: React.FC<TProps>
}

const PageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Пожалуйста, Авторизируйтесь!',
  authorizedOnlyMessage = 'Эта страница доступна только для авторизированных пользователей',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Доступ запрещен',
  checkAccessMessage = 'Вы не имеете доступа к этой странице',
  checkExists,
  checkExistsTitle,
  checkExistsMessage,
  useQuery,
  setProps,
  Page,
  title,
  isTitleExact,
  showLoaderOnFetching = true,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const navigate = useNavigate()
  const ctx = useAppContext()
  const queryResult = useQuery?.()

  const redirectNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectNeeded) {
      void navigate(getAllPostsRoute(), { replace: true })
    }
  }, [redirectNeeded, navigate])

  if (queryResult?.isLoading || (showLoaderOnFetching && queryResult?.isFetching) || redirectNeeded) {
    return <Loader type="page" />
  }

  if (queryResult?.isError) {
    return <ErrorPageComponent message={queryResult.error.message} />
  }

  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }

  const helperProps = { ctx, queryResult: queryResult as never }

  if (checkAccess) {
    const accessDenied = !checkAccess(helperProps)
    if (accessDenied) {
      return <NotFoundPage title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const notExists = !checkExists(helperProps)
    if (notExists) {
      return <NotFoundPage title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const getAuthorizedMe = (message?: string) => {
    if (!ctx.me) {
      throw new GetAuthorizedMeError(message)
    }
    return ctx.me
  }

  try {
    const props = setProps?.({
      ...helperProps,
      checkExists: checkExistsFn,
      checkAccess: checkAccessFn,
      getAuthorizedMe,
    }) as TProps
    const calculatedTitle = typeof title === 'function' ? title({ ...helperProps, ...props }) : title
    const exactTitle = isTitleExact ? calculatedTitle : `${calculatedTitle} - BLOGS APP`
    return (
      <>
        <Helmet>
          <title>{exactTitle}</title>
        </Helmet>
        <Page {...props} />
      </>
    )
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }
    if (error instanceof CheckAccessError) {
      return <ErrorPageComponent title={checkAccessTitle} message={error.message || checkAccessMessage} />
    }

    if (error instanceof GetAuthorizedMeError) {
      return <ErrorPageComponent title={authorizedOnlyTitle} message={error.message || authorizedOnlyMessage} />
    }

    throw error
  }
}

export const wrapperPage = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  PageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    return () => <PageWrapper {...PageWrapperProps} Page={Page} />
  }
}
