import type { Prisma } from '#/generated/prisma/client'
import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { hashPassword } from 'better-auth/crypto'
import { z } from 'zod'
import { prisma } from '#/lib/db/prisma'
import { requireAdmin } from '#/lib/auth/admin.server'
import { resetPasswordInTransaction } from './customers.server'
import { periodSchema, quotaSummary } from '#/modules/usage/usage.options'
import {
  fetchRouterKeys,
  fetchRouterUsagePeriods,
} from '#/modules/usage/usage.server'
import { syncCustomerAccess } from './access.server'

const customerSelect = {
  id: true,
  name: true,
  email: true,
  routerKeyId: true,
  tokenQuota: true,
  isActive: true,
  planName: true,
  accessExpiresAt: true,
  blockedRouterKeyId: true,
} as const
const keyId = z.string().min(1).max(200)
const id = z.string().min(1)
const password = z.string().min(8).max(128)
const quota = z.number().int().min(0).max(2147483647).nullable()
const actorData = (
  actor: { id: string; email: string },
  targetId: string,
  action: string,
  details: Prisma.InputJsonObject,
) => ({ actorId: actor.id, actorEmail: actor.email, targetId, action, details })
async function syncedMessage(message: string) {
  try {
    const result = await syncCustomerAccess()
    return result.failures
      ? message + ' Beberapa key belum tersinkron; sistem akan mencoba kembali.'
      : message
  } catch {
    return (
      message + ' Sinkronisasi 9Router tertunda; sistem akan mencoba kembali.'
    )
  }
}
export const getCustomersServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    setResponseHeader('Cache-Control', 'private, no-store')
    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      select: customerSelect,
      orderBy: { createdAt: 'desc' },
    })
    try {
      const keys = await fetchRouterKeys()
      return {
        customers,
        keys: keys
          .filter((key) => key.isActive)
          .map(({ id, name }) => ({ id, name })),
        message: '',
      }
    } catch {
      return {
        customers,
        keys: [],
        message: 'Tidak dapat mengambil daftar API key. Coba muat ulang.',
      }
    }
  },
)
export const createCustomerServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().toLowerCase().email(),
        password,
        routerKeyId: keyId,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin()
    try {
      const keys = await fetchRouterKeys()
      if (!keys.some((key) => key.id === data.routerKeyId && key.isActive))
        return { success: false, message: 'API key tidak tersedia.' }
      const hashed = await hashPassword(data.password)
      const userId = crypto.randomUUID()
      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: userId,
            name: data.name,
            email: data.email,
            role: 'USER',
            routerKeyId: data.routerKeyId,
            accounts: {
              create: {
                id: crypto.randomUUID(),
                providerId: 'credential',
                accountId: userId,
                password: hashed,
              },
            },
          },
        })
        await tx.auditLog.create({
          data: actorData(actor, userId, 'CUSTOMER_CREATED', {
            email: data.email,
          }),
        })
      })
      return { success: true, message: 'Akun pelanggan berhasil dibuat.' }
    } catch {
      return {
        success: false,
        message:
          'Gagal membuat pelanggan. Pastikan email dan API key belum digunakan.',
      }
    }
  })
export const linkCustomerServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z.object({ userId: id, routerKeyId: keyId.nullable() }).parse(input),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin()
    try {
      if (data.routerKeyId) {
        const keys = await fetchRouterKeys()
        if (!keys.some((key) => key.id === data.routerKeyId && key.isActive))
          return { success: false, message: 'API key tidak tersedia.' }
      }
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirstOrThrow({
          where: { id: data.userId, role: 'USER' },
        })
        if (
          user.blockedRouterKeyId ||
          (!user.isActive && data.routerKeyId) ||
          (user.accessExpiresAt &&
            user.accessExpiresAt <= new Date() &&
            data.routerKeyId)
        )
          throw Error('RESTORE_ACCESS_FIRST')
        await tx.user.update({
          where: { id: user.id },
          data: { routerKeyId: data.routerKeyId },
        })
        await tx.auditLog.create({
          data: actorData(actor, user.id, 'KEY_LINK_CHANGED', {
            keyId: data.routerKeyId,
          }),
        })
      })
      return { success: true, message: 'Koneksi API key diperbarui.' }
    } catch {
      return {
        success: false,
        message:
          'Gagal menghubungkan. Pastikan key belum digunakan dan pulihkan akses pelanggan yang diblokir terlebih dahulu.',
      }
    }
  })
export const getCustomerDetailServerFn = createServerFn({ method: 'GET' })
  .validator((input: unknown) =>
    z.object({ userId: id, period: periodSchema }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdmin()
    setResponseHeader('Cache-Control', 'private, no-store')
    const customer = await prisma.user.findFirst({
      where: { id: data.userId, role: 'USER' },
      select: customerSelect,
    })
    if (!customer) throw Error('CUSTOMER_NOT_FOUND')
    if (!customer.routerKeyId)
      return {
        customer,
        usage: null,
        quota: null,
        message: 'Pelanggan belum dihubungkan ke API key.',
      }
    try {
      const periods = await fetchRouterUsagePeriods(customer.routerKeyId, [
        data.period,
        '30d',
      ])
      const usage = periods.get(data.period)!
      const quotaUsage = periods.get('30d')!

      return {
        customer,
        usage,
        quota: quotaSummary(customer.tokenQuota, quotaUsage.total),
        message: '',
      }
    } catch {
      return {
        customer,
        usage: null,
        quota: null,
        message:
          'Usage tidak tersedia. Periksa status key atau coba muat ulang.',
      }
    }
  })
export const resetCustomerPasswordServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z.object({ userId: id, password }).parse(input),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin()
    try {
      await prisma.$transaction(async (tx) => {
        await resetPasswordInTransaction(tx, data.userId, data.password)
        await tx.auditLog.create({
          data: actorData(actor, data.userId, 'PASSWORD_RESET', {}),
        })
      })
      return {
        success: true,
        message:
          'Password diperbarui. Semua sesi lama pelanggan telah diakhiri.',
      }
    } catch {
      return { success: false, message: 'Gagal mereset password pelanggan.' }
    }
  })
export const saveCustomerQuotaServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z.object({ userId: id, limit: quota }).parse(input),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin()
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirstOrThrow({
          where: { id: data.userId, role: 'USER' },
        })
        await tx.user.update({
          where: { id: user.id },
          data: { tokenQuota: data.limit },
        })
        await tx.auditLog.create({
          data: actorData(actor, user.id, 'QUOTA_CHANGED', {
            limit: data.limit,
          }),
        })
      })
      return {
        success: true,
        message: await syncedMessage('Kuota diperbarui.'),
      }
    } catch {
      return { success: false, message: 'Gagal menyimpan kuota.' }
    }
  })
export const saveCustomerAccessServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z
      .object({
        userId: id,
        isActive: z.boolean(),
        planName: z.string().trim().max(100),
        accessExpiresAt: z.string().datetime().nullable(),
        tokenQuota: quota,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const actor = await requireAdmin()
    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirstOrThrow({
          where: { id: data.userId, role: 'USER' },
        })
        await tx.user.update({
          where: { id: user.id },
          data: {
            isActive: data.isActive,
            planName: data.planName || null,
            accessExpiresAt: data.accessExpiresAt
              ? new Date(data.accessExpiresAt)
              : null,
            tokenQuota: data.tokenQuota,
          },
        })
        if (!data.isActive)
          await tx.session.deleteMany({ where: { userId: user.id } })
        await tx.auditLog.create({
          data: actorData(actor, user.id, 'ACCESS_CHANGED', {
            isActive: data.isActive,
            planName: data.planName,
            accessExpiresAt: data.accessExpiresAt,
            tokenQuota: data.tokenQuota,
          }),
        })
      })
      return {
        success: true,
        message: await syncedMessage('Status dan paket disimpan.'),
      }
    } catch {
      return { success: false, message: 'Gagal menyimpan status dan paket.' }
    }
  })
export const getAuditLogServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    await requireAdmin()
    setResponseHeader('Cache-Control', 'private, no-store')
    const rows = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    const targets = await prisma.user.findMany({
      where: {
        id: { in: rows.flatMap((row) => (row.targetId ? [row.targetId] : [])) },
      },
      select: { id: true, email: true },
    })
    const emails = new Map(targets.map((user) => [user.id, user.email]))
    return rows.map((row) => ({
      ...row,
      targetEmail: row.targetId
        ? (emails.get(row.targetId) ?? 'Akun tidak tersedia')
        : '—',
    }))
  },
)
export const syncAccessServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    await requireAdmin()
    try {
      const result = await syncCustomerAccess()
      return {
        message: result.failures
          ? 'Beberapa key gagal disinkronkan. Coba lagi.'
          : 'Sinkronisasi akses selesai.',
      }
    } catch {
      return { message: '9Router belum dapat dihubungi.' }
    }
  },
)
