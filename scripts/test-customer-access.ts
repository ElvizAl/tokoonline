import assert from 'node:assert/strict'
import { prisma } from '../src/lib/db/prisma'
import { syncCustomerAccess } from '../src/modules/customers/access.server'
import { hashPassword, verifyPassword } from 'better-auth/crypto'
import { resetPasswordInTransaction } from '../src/modules/customers/customers.server'
import { auth } from '../src/lib/auth/auth'

const id = crypto.randomUUID(),
  keyId = 'test-' + id,
  rawKey = 'test-key-' + id,
  email = id + '@tokenmaxxing.invalid'
const originalFetch = globalThis.fetch
let routerActive = true,
  used = 20,
  changes = 0
const oldBase = process.env.NINEROUTER_BASE_URL,
  oldPassword = process.env.NINEROUTER_ADMIN_PASSWORD
process.env.NINEROUTER_BASE_URL = 'https://tokenmaxxing-router.test'
process.env.NINEROUTER_ADMIN_PASSWORD = 'test-only'
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input)
  if (!url.startsWith('https://tokenmaxxing-router.test/'))
    throw Error('Unexpected test network request')
  if (url.endsWith('/api/auth/login'))
    return Response.json(
      { success: true },
      { headers: { 'set-cookie': 'session=test; Path=/' } },
    )
  if (url.endsWith('/api/keys'))
    return Response.json({
      keys: [
        { id: keyId, key: rawKey, name: 'Fixture', isActive: routerActive },
      ],
    })
  if (url.includes('/api/usage/stats'))
    return Response.json({
      byApiKey: {
        [rawKey + '|demo|provider']: {
          requests: 1,
          promptTokens: used,
          completionTokens: 0,
          rawModel: 'demo',
          provider: 'provider',
        },
      },
    })
  if (url.endsWith('/api/keys/' + keyId) && init?.method === 'PUT') {
    routerActive = JSON.parse(String(init.body)).isActive
    changes++
    return Response.json({ key: { isActive: routerActive } })
  }
  throw Error('Unexpected test endpoint')
}) as typeof fetch
try {
  await prisma.user.create({
    data: {
      id,
      name: 'Temporary integration test',
      email,
      role: 'USER',
      routerKeyId: keyId,
      tokenQuota: 10,
      accounts: {
        create: {
          id: crypto.randomUUID(),
          accountId: id,
          providerId: 'credential',
          password: await hashPassword('fixture-old-password'),
        },
      },
    },
  })
  await syncCustomerAccess()
  assert.equal(routerActive, false)
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id } })).blockedRouterKeyId,
    keyId,
  )
  used = 5
  await syncCustomerAccess()
  assert.equal(routerActive, true)
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id } })).blockedRouterKeyId,
    null,
  )
  routerActive = false
  const before = changes
  await syncCustomerAccess()
  assert.equal(changes, before)
  assert.equal(routerActive, false)
  routerActive = true
  await prisma.user.update({
    where: { id },
    data: { accessExpiresAt: new Date(Date.now() - 1000) },
  })
  await syncCustomerAccess()
  assert.equal(routerActive, false)
  await prisma.user.update({ where: { id }, data: { accessExpiresAt: null } })
  await syncCustomerAccess()
  assert.equal(routerActive, true)
  const login = await auth.api.signInEmail({
    body: { email, password: 'fixture-old-password' },
    asResponse: true,
  })
  assert.equal(login.status, 200)
  const cookies = login.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ')
  assert.ok(cookies)
  const changed = await auth.api.changePassword({
    headers: new Headers({ cookie: cookies }),
    body: {
      currentPassword: 'fixture-old-password',
      newPassword: 'fixture-new-password',
      revokeOtherSessions: true,
    },
  })
  assert.ok(changed)
  await prisma.$transaction((tx) =>
    resetPasswordInTransaction(tx, id, 'fixture-admin-reset'),
  )
  const account = await prisma.account.findFirstOrThrow({
    where: { userId: id, providerId: 'credential' },
  })
  assert.equal(
    await verifyPassword({
      hash: account.password!,
      password: 'fixture-admin-reset',
    }),
    true,
  )
  assert.equal(await prisma.session.count({ where: { userId: id } }), 0)
  await prisma.user.update({ where: { id }, data: { isActive: false } })
  await syncCustomerAccess()
  assert.equal(routerActive, false)
  const denied = await auth.api.signInEmail({
    body: { email, password: 'fixture-admin-reset' },
    asResponse: true,
  })
  assert.equal(denied.status, 403)
  assert.ok((await prisma.auditLog.count({ where: { targetId: id } })) > 0)
  console.log(
    'PASS: quota block/restore, manual-key protection, expiry, customer login, own password change, admin reset/session revocation, disabled login, audit',
  )
} finally {
  globalThis.fetch = originalFetch
  if (oldBase === undefined) delete process.env.NINEROUTER_BASE_URL
  else process.env.NINEROUTER_BASE_URL = oldBase
  if (oldPassword === undefined) delete process.env.NINEROUTER_ADMIN_PASSWORD
  else process.env.NINEROUTER_ADMIN_PASSWORD = oldPassword
  await prisma.auditLog.deleteMany({ where: { targetId: id } })
  await prisma.user.deleteMany({ where: { id } })
  await prisma.$disconnect()
}
