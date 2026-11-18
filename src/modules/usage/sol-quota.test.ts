import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseSolQuota, solQuotaForViewer } from './sol-quota.schema'
import { fetchSolQuotaTracker } from './sol-quota.server'

test('users receive shared quota windows without provider identities or metadata', () => {
  const snapshot = {
    checkedAt: '2026-11-19T12:00:00.000Z',
    accounts: [
      {
        id: 'private-provider-id',
        name: 'private-email@example.com',
        session: { usedPercent: 24, resetAt: '2026-11-19T13:00:00.000Z' },
        weekly: null,
        accessToken: 'private-access-token',
      },
    ],
  }
  const userView = solQuotaForViewer(snapshot, 'USER')
  assert.deepEqual(userView, {
    checkedAt: snapshot.checkedAt,
    accounts: [
      {
        id: 'sol-account-1',
        name: 'Akun GPT-6 Sol 1',
        session: snapshot.accounts[0].session,
        weekly: null,
      },
    ],
  })
  assert.equal(JSON.stringify(userView).includes('private-'), false)
  const adminView = solQuotaForViewer(snapshot, 'ADMIN')
  assert.equal(adminView.accounts[0].id, 'private-provider-id')
  assert.equal(adminView.accounts[0].name, 'private-email@example.com')
  assert.equal(
    JSON.stringify(adminView).includes('private-access-token'),
    false,
  )
})

test('quota windows keep exact provider percentages and resets without inventing missing windows', () => {
  const result = parseSolQuota({
    quotas: {
      session: { used: 24, total: 100, resetAt: '2026-11-19T12:00:00Z' },
      weekly: { used: 4, total: 100, resetAt: '2026-11-24T06:50:54.000Z' },
      spark_session: { used: 99, total: 100 },
    },
  })
  assert.deepEqual(result, {
    session: { usedPercent: 24, resetAt: '2026-11-19T12:00:00.000Z' },
    weekly: { usedPercent: 4, resetAt: '2026-11-24T06:50:54.000Z' },
  })
  assert.deepEqual(
    parseSolQuota({
      quotas: { session: { used: 0, total: 100, resetAt: 'invalid' } },
    }),
    {
      session: { usedPercent: 0, resetAt: null },
      weekly: null,
    },
  )
  assert.deepEqual(parseSolQuota({ message: 'Unavailable' }), {
    session: null,
    weekly: null,
  })
  assert.deepEqual(
    parseSolQuota({
      quotas: {
        session: { used: -1, total: 100 },
        weekly: { used: 1, total: 0 },
      },
    }),
    { session: null, weekly: null },
  )
  assert.equal(
    parseSolQuota({ quotas: { session: { used: 110, total: 100 } } }).session
      ?.usedPercent,
    100,
  )
  assert.equal(
    parseSolQuota({
      quotas: { session: { used: 1, total: 100, unlimited: true } },
    }).session,
    null,
  )
})

test('tracker only queries active Codex accounts and isolates upstream failures and credentials', async () => {
  const originalFetch = globalThis.fetch
  const base = process.env.NINEROUTER_BASE_URL
  const password = process.env.NINEROUTER_ADMIN_PASSWORD
  process.env.NINEROUTER_BASE_URL = 'https://router.test'
  process.env.NINEROUTER_ADMIN_PASSWORD = 'fixture-password'
  const paths: string[] = []
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input))
    paths.push(url.pathname)
    if (url.pathname === '/api/auth/login')
      return Response.json(
        { success: true },
        { headers: { 'set-cookie': 'session=fixture' } },
      )
    assert.equal(new Headers(init?.headers).get('cookie'), 'session=fixture')
    if (url.pathname === '/api/providers')
      return Response.json({
        connections: [
          {
            id: 'a',
            provider: 'codex',
            name: 'Account A',
            isActive: true,
            accessToken: 'private-access',
            providerSpecificData: { refreshToken: 'private-refresh' },
          },
          { id: 'b', provider: 'codex', name: 'Account B', isActive: true },
          { id: 'disabled', provider: 'codex', isActive: false },
          { id: 'other', provider: 'claude', isActive: true },
        ],
      })
    if (url.pathname === '/api/usage/a')
      return Response.json({
        quotas: {
          session: { used: 6, total: 100, resetAt: '2026-11-18T13:10:54.000Z' },
        },
        secret: 'private-quota',
      })
    if (url.pathname === '/api/usage/b')
      return Response.json({ error: 'private-error' }, { status: 503 })
    throw Error('Unexpected request')
  }
  try {
    const snapshot = await fetchSolQuotaTracker()
    assert.equal(snapshot.accounts.length, 2)
    assert.deepEqual(snapshot.accounts[0], {
      id: 'a',
      name: 'Account A',
      session: { usedPercent: 6, resetAt: '2026-11-18T13:10:54.000Z' },
      weekly: null,
    })
    assert.deepEqual(snapshot.accounts[1], {
      id: 'b',
      name: 'Account B',
      session: null,
      weekly: null,
    })
    assert.equal(JSON.stringify(snapshot).includes('private-'), false)
    assert.equal(paths.filter((path) => path === '/api/auth/login').length, 1)
    assert.equal(paths.length, 4)
    assert.ok(Number.isFinite(Date.parse(snapshot.checkedAt)))
  } finally {
    globalThis.fetch = originalFetch
    if (base === undefined) delete process.env.NINEROUTER_BASE_URL
    else process.env.NINEROUTER_BASE_URL = base
    if (password === undefined) delete process.env.NINEROUTER_ADMIN_PASSWORD
    else process.env.NINEROUTER_ADMIN_PASSWORD = password
  }
})
