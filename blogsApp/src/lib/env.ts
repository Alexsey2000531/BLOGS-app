import { z } from 'zod'

const zEnv = z.object({
  VITE_TRPC_URL: z.string().trim().min(1),
})

// eslint-disable-next-line node/no-process-env, no-restricted-syntax
export const env = zEnv.parse(import.meta.env)
