export function accessBlockReason(
  customer: {
    isActive: boolean
    accessExpiresAt: Date | null
    tokenQuota: number | null
  },
  used: number,
  now = new Date(),
) {
  if (!customer.isActive) return 'Akun dinonaktifkan'
  if (customer.accessExpiresAt && customer.accessExpiresAt <= now)
    return 'Masa aktif berakhir'
  if (customer.tokenQuota !== null && used >= customer.tokenQuota)
    return 'Kuota 30 hari habis'
  return null
}
