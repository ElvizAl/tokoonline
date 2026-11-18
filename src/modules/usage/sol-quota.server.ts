import { z } from 'zod'
import { routerClient } from './usage.server'
import { parseSolQuota } from './sol-quota.schema'

const connectionsSchema = z.object({
  connections: z.array(
    z.object({
      id: z.string().min(1),
      provider: z.string(),
      name: z.string().nullish(),
      isActive: z.boolean(),
    }),
  ),
})

export async function fetchSolQuotaTracker() {
  const request = await routerClient()
  const { connections } = connectionsSchema.parse(
    await request('/api/providers'),
  )
  const active = connections.filter(
    (connection) => connection.provider === 'codex' && connection.isActive,
  )
  const accounts = []
  // Bound parallel requests when the router has many provider accounts.
  for (let offset = 0; offset < active.length; offset += 3) {
    accounts.push(
      ...(await Promise.all(
        active.slice(offset, offset + 3).map(async (connection, index) => {
          let quota = parseSolQuota(null)
          try {
            quota = parseSolQuota(
              await request(`/api/usage/${encodeURIComponent(connection.id)}`),
            )
          } catch {
            // Keep other accounts visible when one upstream quota request fails.
          }
          return {
            id: connection.id,
            name: connection.name || `Akun Codex ${offset + index + 1}`,
            ...quota,
          }
        }),
      )),
    )
  }
  return { accounts, checkedAt: new Date().toISOString() }
}
