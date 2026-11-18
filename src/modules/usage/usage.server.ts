import { summarizeUsage, summarizeCustomerUsage } from './usage.schema'
import { z } from 'zod'
import type { UsagePeriod } from './usage.options'

const keysSchema = z.object({
  keys: z.array(
    z.object({
      id: z.string(),
      key: z.string().min(1),
      name: z.string(),
      isActive: z.boolean(),
    }),
  ),
})
export function parseRouterKeys(input: unknown) {
  return keysSchema.parse(input).keys
}
export async function routerClient() {
  const base = process.env.NINEROUTER_BASE_URL
  const password = process.env.NINEROUTER_ADMIN_PASSWORD
  if (!base || !password) throw new Error('NOT_CONFIGURED')
  const url = new URL(base)
  if (url.protocol !== 'https:') throw new Error('HTTPS_REQUIRED')
  const login = await fetch(new URL('/api/auth/login', url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  })
  if (!login.ok) throw new Error('UPSTREAM_AUTH_FAILED')
  const cookie = login.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ')
  if (!cookie) throw new Error('UPSTREAM_SESSION_MISSING')
  return async (
    path:
      | '/api/usage/history'
      | '/api/keys'
      | `/api/usage/stats?period=${UsagePeriod}`
      | `/api/keys/${string}`,
    init?: { method: 'PUT'; body: string },
  ) => {
    const response = await fetch(new URL(path, url), {
      method: init?.method,
      body: init?.body,
      headers: { cookie, 'Content-Type': 'application/json' },
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) throw new Error('UPSTREAM_FAILED')
    return response.json() as Promise<unknown>
  }
}
export async function fetchRouterKeys() {
  const get = await routerClient()
  return keysSchema.parse(await get('/api/keys')).keys
}
export async function fetchRouterUsage(
  keyId?: string,
  period: UsagePeriod = 'all',
) {
  const get = await routerClient()
  const history = await get(`/api/usage/stats?period=${period}`)
  if (!keyId) return summarizeUsage(history)
  const keys = keysSchema.parse(await get('/api/keys')).keys
  const key = keys.find((item) => item.id === keyId)
  if (!key) throw new Error('KEY_UNAVAILABLE')
  return summarizeCustomerUsage(history, key.key)
}
