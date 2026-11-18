import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRouterKey } from '#/modules/usage/usage.server'

test('key creation authenticates server-side, validates the response, and does not retry failed writes', async () => {
  const originalFetch = globalThis.fetch
  const originalBase = process.env.NINEROUTER_BASE_URL
  const originalPassword = process.env.NINEROUTER_ADMIN_PASSWORD
  process.env.NINEROUTER_BASE_URL = 'https://router.test'
  process.env.NINEROUTER_ADMIN_PASSWORD = 'test-password'
  let response: unknown = {
    id: 'created-id',
    name: 'Customer key',
    key: 'test-secret-key',
    machineId: 'private-machine',
  }
  let fail = false
  let writes = 0
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input))
    assert.equal(url.origin, 'https://router.test')
    assert.ok(init)
    assert.equal(init.redirect, 'error')
    assert.equal(init.cache, 'no-store')
    if (url.pathname === '/api/auth/login') {
      assert.equal(init.method, 'POST')
      assert.deepEqual(JSON.parse(String(init.body)), {
        password: 'test-password',
      })
      return Response.json(
        { success: true },
        { headers: { 'set-cookie': 'session=fixture; Path=/' } },
      )
    }
    assert.equal(url.pathname, '/api/keys')
    assert.equal(init.method, 'POST')
    assert.equal(new Headers(init.headers).get('cookie'), 'session=fixture')
    assert.deepEqual(JSON.parse(String(init.body)), { name: 'Customer key' })
    writes++
    return Response.json(response, { status: fail ? 503 : 201 })
  }
  try {
    assert.deepEqual(await createRouterKey('Customer key'), {
      id: 'created-id',
      name: 'Customer key',
      key: 'test-secret-key',
    })
    response = { id: 'bad', name: 'Customer key' }
    await assert.rejects(() => createRouterKey('Customer key'))
    fail = true
    await assert.rejects(
      () => createRouterKey('Customer key'),
      /UPSTREAM_FAILED/,
    )
    assert.equal(writes, 3)
  } finally {
    globalThis.fetch = originalFetch
    if (originalBase === undefined) delete process.env.NINEROUTER_BASE_URL
    else process.env.NINEROUTER_BASE_URL = originalBase
    if (originalPassword === undefined)
      delete process.env.NINEROUTER_ADMIN_PASSWORD
    else process.env.NINEROUTER_ADMIN_PASSWORD = originalPassword
  }
})
