import { z } from 'zod'

const windowSchema = z.object({
  used: z.number().finite().nonnegative(),
  total: z.number().finite().positive(),
  resetAt: z.unknown().optional(),
  unlimited: z.boolean().optional(),
})

function parseWindow(input: unknown) {
  const parsed = windowSchema.safeParse(input)
  if (!parsed.success || parsed.data.unlimited) return null
  const { used, total, resetAt } = parsed.data
  const timestamp = typeof resetAt === 'string' ? Date.parse(resetAt) : NaN
  return {
    usedPercent: Math.min(100, (used / total) * 100),
    resetAt: Number.isFinite(timestamp)
      ? new Date(timestamp).toISOString()
      : null,
  }
}

export function parseSolQuota(input: unknown) {
  const parsed = z
    .object({
      quotas: z.object({
        session: z.unknown().optional(),
        weekly: z.unknown().optional(),
      }),
    })
    .safeParse(input)
  return {
    session: parseWindow(
      parsed.success ? parsed.data.quotas.session : undefined,
    ),
    weekly: parseWindow(parsed.success ? parsed.data.quotas.weekly : undefined),
  }
}

export type SolQuotaWindow = ReturnType<typeof parseWindow>

export function solQuotaForViewer(
  snapshot: {
    accounts: Array<{
      id: string
      name: string
      session: SolQuotaWindow
      weekly: SolQuotaWindow
    }>
    checkedAt: string
  },
  role: 'ADMIN' | 'USER',
) {
  return {
    checkedAt: snapshot.checkedAt,
    accounts: snapshot.accounts.map((account, index) => ({
      id: role === 'ADMIN' ? account.id : `sol-account-${index + 1}`,
      name: role === 'ADMIN' ? account.name : `Akun GPT-6 Sol ${index + 1}`,
      session: account.session,
      weekly: account.weekly,
    })),
  }
}
