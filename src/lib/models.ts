export const SUPPORTED_MODELS = [
  'cx/gpt-6-luna',
  'cx/gpt-5.6-luna',
  'cx/gpt-5.6-terra',
  'cx/gpt-5.6-sol',
  'cx/gpt-6-sol',
] as const
export type ModelId = (typeof SUPPORTED_MODELS)[number]
