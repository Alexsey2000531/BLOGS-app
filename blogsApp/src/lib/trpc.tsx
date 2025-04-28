import type { TrpcRouter } from '@BLOGS/backend/src/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink, TRPCLink } from '@trpc/client'
import { createTRPCReact, type CreateTRPCReact } from '@trpc/react-query'
import { observable } from '@trpc/server/observable'
import Cookies from 'js-cookie'
import React from 'react'
import superjson from 'superjson'
import { env } from './env.ts'
import { sentryCaptureException } from './sentry.tsx'

export const trpc: CreateTRPCReact<TrpcRouter, unknown, null> = createTRPCReact<TrpcRouter>()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const customTrpcLink: TRPCLink<TrpcRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unscribe = next(op).subscribe({
        next(value) {
          observer.next(value)
        },
        error(error) {
          if (!error.data?.isExpected) {
            sentryCaptureException(error)
            if (env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-undef, no-console
              console.error(error)
            }
          }
          observer.error(error)
        },
        complete() {
          observer.complete()
        },
      })
      return unscribe
    })
  }
}

const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    customTrpcLink,
    loggerLink({
      enabled: () => env.NODE_ENV === 'development',
    }),
    httpBatchLink({
      url: env.VITE_TRPC_URL,
      headers: () => {
        const token = Cookies.get('token')
        return {
          ...(token && { authorization: `Bearer ${token}` }),
        }
      },
    }),
  ],
})

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
