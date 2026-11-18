import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { auth } from '#/lib/auth/auth'
import { prisma } from '#/lib/db/prisma'
import { fetchSolQuotaTracker } from './sol-quota.server'
import { solQuotaForViewer } from './sol-quota.schema'

export const getSolQuotaServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    setResponseHeader('Cache-Control', 'private, no-store')
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw new Error('UNAUTHORIZED')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true },
    })
    if (!user?.isActive) throw new Error('UNAUTHORIZED')
    try {
      const snapshot = await fetchSolQuotaTracker()
      return {
        status: 'ready' as const,
        ...solQuotaForViewer(snapshot, user.role),
      }
    } catch {
      return { status: 'error' as const, accounts: [], checkedAt: null }
    }
  },
)
