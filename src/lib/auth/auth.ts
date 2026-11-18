import { betterAuth } from 'better-auth/minimal'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { APIError } from 'better-auth/api'
import { prisma } from '../db/prisma'

export const auth = betterAuth({
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
          })
          if (!user?.isActive)
            throw new APIError('FORBIDDEN', {
              message: 'Akun dinonaktifkan. Hubungi admin.',
            })
        },
      },
    },
  },
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        defaultValue: 'USER',
        required: false,
        input: false,
      },
    },
  },
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [tanstackStartCookies()],
})
