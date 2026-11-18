import { z } from 'zod'
import { SUPPORTED_MODELS } from '#/lib/models'
export function ownedKey<T extends { id: string; key: string }>(
  keys: T[],
  id: string,
) {
  const key = keys.find((key) => key.id === id)
  if (!key) throw Error('KEY_NOT_FOUND')
  return key
}
export function maskKey(key: string) {
  return key.length > 12
    ? key.slice(0, 4) + '••••••••' + key.slice(-4)
    : '••••••••'
}
export function parseModels(input: unknown) {
  const result = z
    .object({ data: z.array(z.object({ id: z.string().min(1) })) })
    .parse(input)
  return [...new Set(result.data.map((model) => model.id))].filter((id) =>
    SUPPORTED_MODELS.some((model) => model === id),
  )
}
