import { test } from 'node:test'
import assert from 'node:assert/strict'
import { summarizeUsage, summarizeCustomerUsage } from './usage.schema'

const fixture = {
  totalRequests: 2,
  totalPromptTokens: 10,
  totalCompletionTokens: 5,
  byModel: { demo: { requests: 2, promptTokens: 10, completionTokens: 5 } },
  recentRequests: [
    {
      timestamp: '2026-11-18T00:00:00Z',
      model: 'demo',
      promptTokens: 10,
      completionTokens: 5,
      status: 'success',
      apiKey: 'private-key',
    },
  ],
  byAccount: { privateEmail: 'private-account' },
  byApiKey: { secret: 'private-key' },
}

test('returns correct totals without upstream credentials or account metadata', () => {
  const result = summarizeUsage(fixture)
  assert.equal(result.total, 15)
  assert.equal(result.models[0].tokens, 15)
  assert.equal(result.recent[0].tokens, 15)
  const serialized = JSON.stringify(result)
  assert.equal(serialized.includes('private-'), false)
  assert.equal(serialized.includes('byApiKey'), false)
})

test('rejects invalid payloads instead of displaying fabricated zero usage', () => {
  assert.throws(() => summarizeUsage({ error: 'unauthorized' }))
  assert.throws(() => summarizeUsage({ ...fixture, totalPromptTokens: -1 }))
})

test('customer summary isolates exact key and never includes global recent requests', () => {
  const row = {
    requests: 1,
    promptTokens: 12,
    completionTokens: 3,
    rawModel: 'demo',
    provider: 'provider',
  }
  const input = {
    ...fixture,
    byApiKey: {
      'customer-a|demo|provider': row,
      'customer-ab|demo|provider': { ...row, promptTokens: 999 },
      'customer-b|demo|provider': { ...row, promptTokens: 777 },
    },
  }
  const result = summarizeCustomerUsage(input, 'customer-a')
  assert.equal(result.requests, 1)
  assert.equal(result.input, 12)
  assert.equal(result.total, 15)
  assert.deepEqual(result.recent, [])
  assert.equal(JSON.stringify(result).includes('customer-'), false)
  const empty = summarizeCustomerUsage(input, 'never-used')
  assert.equal(empty.total, 0)
  assert.deepEqual(empty.models, [])
  assert.throws(() => summarizeCustomerUsage(input, ''))
})
