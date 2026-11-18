import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'
import { prisma } from '#/lib/db/prisma'

export const getSessionServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() })
    if (!session) return null
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        role: true,
        isActive: true,
        planName: true,
        accessExpiresAt: true,
      },
    })
    return user?.isActive ? { user } : null
  },
)

export const logoutServerFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    await auth.api.signOut({ headers: getRequestHeaders() })
    return { success: true }
  },
)
