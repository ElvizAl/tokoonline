import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ownedKey, maskKey, parseModels } from './access.schema'
import { SUPPORTED_MODELS } from '#/lib/models'
test('only the assigned key is selected; missing IDs never fall back to another customer', () => {
  const keys = [
    { id: 'a', key: 'private-a' },
    { id: 'b', key: 'private-b' },
  ]
  assert.equal(ownedKey(keys, 'b').key, 'private-b')
  assert.throws(() => ownedKey(keys, 'missing'))
})
test('short and long API keys are masked before client loading', () => {
  assert.equal(maskKey('short'), '••••••••')
  const key = 'abcdefghijklmno1234'
  const masked = maskKey(key)
  assert.equal(masked.includes(key), false)
  assert.equal(masked.endsWith('1234'), true)
})
test('only supported exact model IDs are shown without duplicates or invented models', () => {
  assert.deepEqual(
    parseModels({
      data: [
        { id: 'cx/gpt-6-luna', secret: 'private' },
        { id: 'cx/gpt-6-luna[1m]' },
        { id: 'cx/gpt-6-sol-review' },
        { id: 'cx/gpt-6-luna' },
      ],
    }),
    ['cx/gpt-6-luna'],
  )
  assert.throws(() => parseModels({ error: 'unauthorized' }))
  assert.deepEqual(parseModels({ data: [{ id: 'cx/gpt-6-sol-review' }] }), [])
  assert.deepEqual(
    parseModels({ data: SUPPORTED_MODELS.map((id) => ({ id })) }),
    [...SUPPORTED_MODELS],
  )
})
