import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { APIError } from 'better-auth/api'
import { loginSchema } from './auth.schema'
import { auth } from '#/lib/auth/auth'

export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      await auth.api.signInEmail({ body: data, headers: getRequestHeaders() })
      return { success: true as const, message: 'Login berhasil.' }
    } catch (error) {
      if (error instanceof APIError) {
        return {
          success: false as const,
          message:
            error.status === 'TOO_MANY_REQUESTS'
              ? 'Terlalu banyak percobaan. Coba lagi nanti.'
              : 'Tidak dapat masuk. Periksa email dan kata sandi kamu.',
        }
      }
      return {
        success: false as const,
        message: 'Layanan login sedang bermasalah. Coba lagi nanti.',
      }
    }
  })
