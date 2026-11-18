import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'
import { prisma } from '#/lib/db/prisma'

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw new Error('UNAUTHORIZED')
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true, isActive: true },
  })
  if (user?.role !== 'ADMIN' || !user.isActive) throw new Error('FORBIDDEN')
  return user
}
