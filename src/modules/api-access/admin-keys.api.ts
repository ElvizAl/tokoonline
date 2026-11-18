import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { z } from 'zod'
import { requireAdmin } from '#/lib/auth/admin.server'
import { prisma } from '#/lib/db/prisma'
import { createRouterKey } from '#/modules/usage/usage.server'

export const createApiKeyServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z.object({ name: z.string().trim().min(1).max(100) }).parse(input),
  )
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control', 'private, no-store')
    const actor = await requireAdmin()
    let key: Awaited<ReturnType<typeof createRouterKey>>
    try {
      key = await createRouterKey(data.name)
    } catch {
      return {
        success: false as const,
        key: null,
        message:
          'Pembuatan API key belum dapat dikonfirmasi. Muat ulang daftar key sebelum mencoba lagi.',
      }
    }
    // The remote key already exists. An audit failure must not invite a duplicate.
    let message = 'API key berhasil dibuat. Key sudah tersedia untuk pelanggan.'
    try {
      await prisma.auditLog.create({
        data: {
          actorId: actor.id,
          actorEmail: actor.email,
          action: 'API_KEY_CREATED',
          details: { keyId: key.id, keyName: key.name },
        },
      })
    } catch {
      message =
        'API key berhasil dibuat, tetapi riwayat aktivitas gagal dicatat.'
    }
    return { success: true as const, key, message }
  })
