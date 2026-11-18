import assert from 'node:assert/strict'
import { test } from 'node:test'
import { accessBlockReason } from './access-policy'
const base = { isActive: true, accessExpiresAt: null, tokenQuota: 100 }
test('access policy covers disabled, expired, quota and unlimited accounts', () => {
  const now = new Date('2026-11-18T00:00:00Z')
  assert.equal(accessBlockReason(base, 99, now), null)
  assert.equal(accessBlockReason(base, 100, now), 'Kuota 30 hari habis')
  assert.equal(
    accessBlockReason({ ...base, tokenQuota: null }, 100000, now),
    null,
  )
  assert.equal(
    accessBlockReason({ ...base, tokenQuota: 0 }, 0, now),
    'Kuota 30 hari habis',
  )
  assert.equal(
    accessBlockReason({ ...base, accessExpiresAt: now }, 0, now),
    'Masa aktif berakhir',
  )
  assert.equal(
    accessBlockReason({ ...base, isActive: false }, 0, now),
    'Akun dinonaktifkan',
  )
})
