import { z } from 'zod'
export const periodSchema = z.enum(['today', '7d', '30d', 'all'])
export type UsagePeriod = z.infer<typeof periodSchema>
export function quotaSummary(limit: number | null, used: number) {
  return {
    limit,
    used,
    remaining: limit === null ? null : Math.max(0, limit - used),
    exceeded: limit !== null && used >= limit,
  }
}
