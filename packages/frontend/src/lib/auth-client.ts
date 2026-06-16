import { createAuthClient } from 'better-auth/react'

const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined
const authBaseUrl = backendUrl?.replace(/\/api\/?$/, '')

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
})
