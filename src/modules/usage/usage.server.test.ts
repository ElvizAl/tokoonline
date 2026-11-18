import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchRouterUsagePeriods } from './usage.server'
test('multiple customer usage periods share one login and one key lookup', async () => {
  const originalFetch = globalThis.fetch,
    base = process.env.NINEROUTER_BASE_URL,
    password = process.env.NINEROUTER_ADMIN_PASSWORD
  process.env.NINEROUTER_BASE_URL = 'https://router.test'
  process.env.NINEROUTER_ADMIN_PASSWORD = 'test'
  const calls: string[] = []
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    calls.push(url.pathname + url.search)
    if (url.pathname === '/api/auth/login')
      return Response.json(
        { success: true },
        { headers: { 'set-cookie': 'session=test' } },
      )
    if (url.pathname === '/api/keys')
      return Response.json({
        keys: [
          {
            id: 'owned',
            key: 'private-fixture',
            name: 'Fixture',
            isActive: true,
          },
        ],
      })
    if (url.pathname === '/api/usage/stats')
      return Response.json({
        byApiKey: {
          'private-fixture|demo|provider': {
            requests: 1,
            promptTokens: 2,
            completionTokens: 3,
            rawModel: 'demo',
            provider: 'provider',
          },
        },
      })
    throw Error('Unexpected endpoint')
  }) as typeof fetch
  try {
    const data = await fetchRouterUsagePeriods('owned', ['all', '30d', 'all'])
    assert.equal(calls.length, 4)
    assert.equal(calls.filter((path) => path === '/api/auth/login').length, 1)
    assert.equal(calls.filter((path) => path === '/api/keys').length, 1)
    assert.equal(data.get('all')?.total, 5)
    assert.equal(data.get('30d')?.total, 5)
    await assert.rejects(
      () => fetchRouterUsagePeriods('deleted-key', ['all']),
      /KEY_UNAVAILABLE/,
    )
  } finally {
    globalThis.fetch = originalFetch
    if (base === undefined) delete process.env.NINEROUTER_BASE_URL
    else process.env.NINEROUTER_BASE_URL = base
    if (password === undefined) delete process.env.NINEROUTER_ADMIN_PASSWORD
    else process.env.NINEROUTER_ADMIN_PASSWORD = password
  }
})
