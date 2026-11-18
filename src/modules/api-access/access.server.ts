import { prisma } from '#/lib/db/prisma'
import { fetchRouterKeys } from '#/modules/usage/usage.server'
import { ownedKey, maskKey, parseModels } from './access.schema'
export async function customerKey(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true, routerKeyId: true },
  })
  if (!user?.isActive) throw Error('UNAUTHORIZED')
  if (!user.routerKeyId) return null
  return ownedKey(await fetchRouterKeys(), user.routerKeyId)
}
export async function customerAccessInfo(userId: string) {
  const configured = process.env.NINEROUTER_BASE_URL
  if (!configured) throw Error('NOT_CONFIGURED')
  const base = new URL(configured)
  if (base.protocol !== 'https:') throw Error('HTTPS_REQUIRED')
  const baseUrl = new URL('/v1', base).href
  const key = await customerKey(userId)
  if (!key)
    return {
      status: 'unlinked' as const,
      baseUrl,
      maskedKey: null,
      keyName: '',
      keyActive: false,
      models: [] as string[],
      message:
        'Akun kamu belum terhubung ke API key. Hubungi admin untuk mendapatkan akses.',
    }
  let models: string[] = []
  let message = ''
  if (key.isActive) {
    try {
      const response = await fetch(new URL('/v1/models', base), {
        headers: { Authorization: 'Bearer ' + key.key },
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(12000),
      })
      if (!response.ok) throw Error('MODELS_UNAVAILABLE')
      models = parseModels(await response.json())
    } catch {
      message = 'Daftar model belum dapat dimuat. Coba muat ulang halaman.'
    }
  } else
    message =
      'API key sedang nonaktif. Hubungi admin untuk memeriksa kuota atau masa aktif.'
  return {
    status: 'linked' as const,
    baseUrl,
    maskedKey: maskKey(key.key),
    keyName: key.name,
    keyActive: key.isActive,
    models,
    message,
  }
}
