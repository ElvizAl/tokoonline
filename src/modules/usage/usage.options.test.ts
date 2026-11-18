import assert from 'node:assert/strict'
import { test } from 'node:test'
import { quotaSummary, periodSchema } from './usage.options'
test('quota handles unlimited, exhausted and remaining tokens independently of selected filter', () => {
  assert.deepEqual(quotaSummary(null, 50), {
    limit: null,
    used: 50,
    remaining: null,
    exceeded: false,
  })
  assert.deepEqual(quotaSummary(100, 50), {
    limit: 100,
    used: 50,
    remaining: 50,
    exceeded: false,
  })
  assert.equal(quotaSummary(100, 120).remaining, 0)
  assert.equal(quotaSummary(100, 100).exceeded, true)
  assert.equal(quotaSummary(0, 0).exceeded, true)
})
test('only supported upstream periods can be requested', () => {
  for (const value of ['today', '7d', '30d', 'all'])
    assert.equal(periodSchema.parse(value), value)
  assert.throws(() => periodSchema.parse('../../settings'))
})
