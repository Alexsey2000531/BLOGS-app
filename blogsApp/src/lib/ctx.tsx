import type { TrpcRouterOutput } from '@BLOGS/backend/src/router'
import { createContext, useContext } from 'react'
import React from 'react'
import { trpc } from './trpc'
import { Loader } from '../components/Loader'

export type AppContext = {
  me: TrpcRouterOutput['getMe']['me']
}

const AppReactContext = createContext<AppContext>({
  me: null,
})

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery()
  return (
    <AppReactContext.Provider value={{ me: data?.me || null }}>
      {isLoading || isFetching ? <Loader type="page" /> : isError ? <p>Ошибка: {error.message}</p> : children}
    </AppReactContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppContext()
  return me
}
