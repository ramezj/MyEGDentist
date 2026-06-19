import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from '@myegdentist/api'

const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
const authBaseUrl = backendUrl?.replace(/\/api\/?$/, '')

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [inferAdditionalFields<typeof auth>()],
})
