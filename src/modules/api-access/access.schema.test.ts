import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ownedKey, maskKey, parseModels } from './access.schema'
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
test('only exact cx/gpt-6-luna is shown, with no duplicate or unavailable models', () => {
  assert.deepEqual(
    parseModels({
      data: [
        { id: 'cx/gpt-6-luna', secret: 'private' },
        { id: 'cx/gpt-6-luna[1m]' },
        { id: 'cx/gpt-6-sol' },
        { id: 'cx/gpt-6-luna' },
      ],
    }),
    ['cx/gpt-6-luna'],
  )
  assert.throws(() => parseModels({ error: 'unauthorized' }))
  assert.deepEqual(parseModels({ data: [{ id: 'cx/gpt-6-sol' }] }), [])
})
