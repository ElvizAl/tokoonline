import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { z } from 'zod'
import { auth } from '#/lib/auth/auth'
import { prisma } from '#/lib/db/prisma'
import { fetchRouterUsage } from './usage.server'
import { periodSchema, quotaSummary } from './usage.options'

export const getUsageServerFn = createServerFn({ method: 'GET' })
  .validator((input: unknown) =>
    z.object({ period: periodSchema.default('all') }).parse(input ?? {}),
  )
  .handler(async ({ data: options }) => {
    setResponseHeader('Cache-Control', 'private, no-store')
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) throw new Error('UNAUTHORIZED')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        routerKeyId: true,
        tokenQuota: true,
        isActive: true,
      },
    })
    if (!user?.isActive) throw new Error('UNAUTHORIZED')
    const isAdmin = user.role === 'ADMIN'
    if (!isAdmin && !user?.routerKeyId)
      return {
        status: 'unlinked' as const,
        data: null,
        quota: null,
        message: 'Hubungi admin untuk menghubungkan API key pelanggan.',
      }
    try {
      const key = isAdmin ? undefined : user!.routerKeyId!
      const data = await fetchRouterUsage(key, options.period)
      const monthly = !isAdmin
        ? options.period === '30d'
          ? data
          : await fetchRouterUsage(key, '30d')
        : null
      return {
        status: 'connected' as const,
        data,
        quota: monthly ? quotaSummary(user!.tokenQuota, monthly.total) : null,
        message: isAdmin
          ? 'Ringkasan seluruh pelanggan · khusus admin'
          : 'Pemakaian API key milik akun kamu',
      }
    } catch {
      return {
        status: 'error' as const,
        data: null,
        quota: null,
        message:
          'Tidak dapat mengambil usage 9Router. Periksa konfigurasi atau coba muat ulang.',
      }
    }
  })
