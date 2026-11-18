import assert from 'node:assert/strict'
import { prisma } from '../src/lib/db/prisma'
import {
  customerAccessInfo,
  customerKey,
} from '../src/modules/api-access/access.server'
const suffix = crypto.randomUUID(),
  a = 'test-a-' + suffix,
  b = 'test-b-' + suffix
const originalFetch = globalThis.fetch,
  originalBase = process.env.NINEROUTER_BASE_URL,
  originalPassword = process.env.NINEROUTER_ADMIN_PASSWORD
const keyA = 'fixture-key-a-' + suffix,
  keyB = 'fixture-key-b-' + suffix
process.env.NINEROUTER_BASE_URL = 'https://tokenmaxxing-router.test'
process.env.NINEROUTER_ADMIN_PASSWORD = 'test-only'
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input)
  if (!url.startsWith('https://tokenmaxxing-router.test/'))
    throw Error('Unexpected test request')
  if (url.endsWith('/api/auth/login'))
    return Response.json(
      { success: true },
      { headers: { 'set-cookie': 'session=test; Path=/' } },
    )
  if (url.endsWith('/api/keys'))
    return Response.json({
      keys: [
        { id: a, key: keyA, name: 'A', isActive: true },
        { id: b, key: keyB, name: 'B', isActive: true },
      ],
    })
  if (url.endsWith('/v1/models')) {
    const authorization = new Headers(init?.headers).get('Authorization')
    assert.ok(
      authorization === 'Bearer ' + keyA || authorization === 'Bearer ' + keyB,
    )
    return Response.json({
      data: [
        {
          id:
            authorization === 'Bearer ' + keyA
              ? 'cx/gpt-6-luna'
              : 'cx/gpt-6-sol',
          private: 'metadata',
        },
      ],
    })
  }
  throw Error('Unexpected endpoint')
}) as typeof fetch
try {
  await prisma.user.createMany({
    data: [
      {
        id: a,
        name: 'Test A',
        email: a + '@tokenmaxxing.invalid',
        routerKeyId: a,
      },
      {
        id: b,
        name: 'Test B',
        email: b + '@tokenmaxxing.invalid',
        routerKeyId: b,
      },
    ],
  })
  const infoA = await customerAccessInfo(a),
    infoB = await customerAccessInfo(b)
  assert.deepEqual(infoA.models, ['cx/gpt-6-luna'])
  assert.deepEqual(infoB.models, ['cx/gpt-6-sol'])
  assert.equal(JSON.stringify(infoA).includes(keyA), false)
  assert.equal(JSON.stringify(infoA).includes(keyB), false)
  assert.equal(infoA.baseUrl, 'https://tokenmaxxing-router.test/v1')
  assert.equal((await customerKey(a))?.key, keyA)
  await prisma.user.update({ where: { id: a }, data: { isActive: false } })
  await assert.rejects(() => customerKey(a))
  await prisma.user.update({ where: { id: b }, data: { routerKeyId: null } })
  assert.equal((await customerAccessInfo(b)).status, 'unlinked')
  console.log(
    'PASS: per-customer key/model isolation, masked loader, base URL, disabled and unlinked accounts',
  )
} finally {
  globalThis.fetch = originalFetch
  if (originalBase === undefined) delete process.env.NINEROUTER_BASE_URL
  else process.env.NINEROUTER_BASE_URL = originalBase
  if (originalPassword === undefined)
    delete process.env.NINEROUTER_ADMIN_PASSWORD
  else process.env.NINEROUTER_ADMIN_PASSWORD = originalPassword
  await prisma.user.deleteMany({ where: { id: { in: [a, b] } } })
  await prisma.$disconnect()
}
