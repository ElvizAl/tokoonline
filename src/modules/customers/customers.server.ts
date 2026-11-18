import { hashPassword } from 'better-auth/crypto'
import type { Prisma } from '#/generated/prisma/client'
import { prisma } from '#/lib/db/prisma'

export async function resetPasswordInTransaction(
  tx: Prisma.TransactionClient,
  userId: string,
  password: string,
) {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  if (user?.role !== 'USER') throw new Error('CUSTOMER_NOT_FOUND')
  const hashed = await hashPassword(password)
  const result = await tx.account.updateMany({
    where: { userId, providerId: 'credential' },
    data: { password: hashed },
  })
  if (result.count !== 1) throw new Error('CREDENTIAL_NOT_FOUND')
  await tx.session.deleteMany({ where: { userId } })
}
export async function resetCustomerPassword(userId: string, password: string) {
  await prisma.$transaction((tx) =>
    resetPasswordInTransaction(tx, userId, password),
  )
}
