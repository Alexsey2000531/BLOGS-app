import { type UseTRPCQueryResult, type UseTRPCQuerySuccessResult } from '@trpc/react-query/shared'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorPageComponent } from '../components/ErrorPageComponent/index'
import { useAppContext, type AppContext } from './ctx'
import { getAllPostsRoute } from './routes'

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

  useQuery?: () => TQueryResult
  setProps?: (helperProps: HelperProps<TQueryResult>) => TProps
  Page: React.FC<TProps>
}

const PageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Пожалуйста, Авторизируйтесь',
  authorizedOnlyMessage = 'Эта страница доступна только для авторизированных пользователей',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Доступ запрещен',
  checkAccessMessage = 'Вы не имеете доступа к этой странице',
  checkExists,
  checkExistsTitle = 'Не найдена!',
  checkExistsMessage = 'Эта страница не существует!',
  useQuery,
  setProps,
  Page,
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

  if (queryResult?.isLoading || queryResult?.isFetching || redirectNeeded) {
    return <p>Loading...</p>
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
      return <ErrorPageComponent title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const notExists = !checkExists(helperProps)
    if (notExists) {
      return <ErrorPageComponent title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const props = setProps?.(helperProps) as TProps
  return <Page {...props} />
}

export const wrapperPage = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  PageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    return () => <PageWrapper {...PageWrapperProps} Page={Page} />
  }
}
