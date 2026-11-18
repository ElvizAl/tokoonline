import { createServerFn } from '@tanstack/react-start'
import {
  getRequestHeaders,
  setResponseHeader,
} from '@tanstack/react-start/server'
import { auth } from '#/lib/auth/auth'
import { customerAccessInfo, customerKey } from './access.server'
async function viewer() {
  setResponseHeader('Cache-Control', 'private, no-store')
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw Error('UNAUTHORIZED')
  return session.user.id
}
export const getApiAccessServerFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const id = await viewer()
    try {
      return await customerAccessInfo(id)
    } catch (error) {
      return {
        status: 'error' as const,
        baseUrl: '',
        maskedKey: null,
        keyName: '',
        keyActive: false,
        models: [] as string[],
        message:
          error instanceof Error && error.message === 'KEY_NOT_FOUND'
            ? 'API key yang terhubung sudah tidak tersedia di 9Router. Hubungi admin untuk mendapatkan key baru.'
            : 'Informasi API belum tersedia. Coba muat ulang atau hubungi admin.',
      }
    }
  },
)
export const revealOwnApiKeyServerFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  const id = await viewer()
  try {
    const key = await customerKey(id)
    if (!key)
      return {
        success: false as const,
        key: null,
        message: 'API key belum dihubungkan.',
      }
    return { success: true as const, key: key.key, message: '' }
  } catch {
    return {
      success: false as const,
      key: null,
      message: 'Tidak dapat mengambil API key. Coba lagi.',
    }
  }
})
