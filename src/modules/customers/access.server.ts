import { prisma } from '#/lib/db/prisma'
import { routerClient, parseRouterKeys } from '#/modules/usage/usage.server'
import { summarizeCustomerUsage } from '#/modules/usage/usage.schema'
import { accessBlockReason } from './access-policy'

let running: Promise<{ failures: number }> | undefined
export function syncCustomerAccess() {
  if (running) return running
  running = synchronize().finally(() => {
    running = undefined
  })
  return running
}
async function synchronize() {
  const customers = await prisma.user.findMany({
    where: { role: 'USER', routerKeyId: { not: null } },
  })
  if (!customers.length) return { failures: 0 }
  const request = await routerClient()
  const keys = parseRouterKeys(await request('/api/keys'))
  const history = await request('/api/usage/stats?period=30d')
  let failures = 0
  for (const customer of customers) {
    const key = keys.find((key) => key.id === customer.routerKeyId)
    if (!key) {
      failures++
      continue
    }
    try {
      await prisma.$transaction(async (tx) => {
        const locked = await tx.$queryRaw<
          Array<{ locked: boolean }>
        >`SELECT pg_try_advisory_xact_lock(hashtext(${customer.id})) AS locked`
        if (!locked[0]?.locked) return
        const current = await tx.user.findUniqueOrThrow({
          where: { id: customer.id },
        })
        if (current.routerKeyId !== key.id) return
        const used = summarizeCustomerUsage(history, key.key).total
        const reason = accessBlockReason(current, used)
        if (reason && key.isActive && !current.blockedRouterKeyId) {
          // Persist ownership before the upstream call; a failed call is retried next cycle.
          await tx.user.update({
            where: { id: current.id },
            data: { blockedRouterKeyId: key.id },
          })
        }
      })
      const current = await prisma.user.findUniqueOrThrow({
        where: { id: customer.id },
      })
      if (
        current.routerKeyId !== key.id ||
        current.blockedRouterKeyId !== key.id
      )
        continue
      const reason = accessBlockReason(
        current,
        summarizeCustomerUsage(history, key.key).total,
      )
      const active = !reason
      if (key.isActive !== active) {
        await request(`/api/keys/${encodeURIComponent(key.id)}`, {
          method: 'PUT',
          body: JSON.stringify({ isActive: active }),
        })
        await prisma.auditLog.create({
          data: {
            actorId: 'system',
            actorEmail: 'system',
            targetId: current.id,
            action: active ? 'KEY_ENABLED' : 'KEY_BLOCKED',
            details: { reason: reason ?? 'Batas akses telah dipulihkan' },
          },
        })
      }
      if (active)
        await prisma.user.updateMany({
          where: {
            id: current.id,
            routerKeyId: key.id,
            blockedRouterKeyId: key.id,
          },
          data: { blockedRouterKeyId: null },
        })
    } catch {
      failures++
    }
  }
  return { failures }
}
