import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { auth } from './auth'
import { prisma } from '#/lib/db/prisma'
export const changeOwnPasswordServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) =>
    z
      .object({
        currentPassword: z.string().min(1).max(128),
        newPassword: z.string().min(8).max(128),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw Error('UNAUTHORIZED')
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isActive: true },
    })
    if (!user?.isActive) throw Error('UNAUTHORIZED')
    try {
      await auth.api.changePassword({
        headers,
        body: { ...data, revokeOtherSessions: true },
      })
      return {
        success: true,
        message: 'Password diperbarui. Sesi di perangkat lain telah diakhiri.',
      }
    } catch {
      return {
        success: false,
        message:
          'Tidak dapat mengganti password. Periksa password saat ini dan coba lagi.',
      }
    }
  })
