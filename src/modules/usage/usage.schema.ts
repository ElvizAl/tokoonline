import { z } from 'zod'

const counter = z.number().finite().nonnegative()
const modelSchema = z.object({
  requests: counter,
  promptTokens: counter,
  completionTokens: counter,
})
const historySchema = z.object({
  totalRequests: counter,
  totalPromptTokens: counter,
  totalCompletionTokens: counter,
  byModel: z.record(z.string(), modelSchema),
  recentRequests: z.array(
    z.object({
      timestamp: z.string(),
      model: z.string(),
      promptTokens: counter,
      completionTokens: counter,
      status: z.string(),
    }),
  ),
})

// Explicit allowlist: never return provider accounts, keys or raw upstream payloads.
export function summarizeUsage(input: unknown) {
  const data = historySchema.parse(input)
  return {
    requests: data.totalRequests,
    input: data.totalPromptTokens,
    output: data.totalCompletionTokens,
    total: data.totalPromptTokens + data.totalCompletionTokens,
    models: Object.entries(data.byModel)
      .map(([name, value]) => ({
        name,
        requests: value.requests,
        tokens: value.promptTokens + value.completionTokens,
      }))
      .sort((a, b) => b.tokens - a.tokens),
    recent: data.recentRequests.slice(0, 20).map((row) => ({
      ...row,
      tokens: row.promptTokens + row.completionTokens,
    })),
  }
}

export function summarizeCustomerUsage(input: unknown, apiKey: string) {
  if (!apiKey.trim()) throw new Error('KEY_REQUIRED')
  const schema = z.object({
    byApiKey: z.record(
      z.string(),
      modelSchema.extend({ rawModel: z.string(), provider: z.string() }),
    ),
  })
  const history = schema.parse(input)
  const models: Record<
    string,
    { requests: number; promptTokens: number; completionTokens: number }
  > = {}
  let totalRequests = 0,
    totalPromptTokens = 0,
    totalCompletionTokens = 0
  for (const [identity, row] of Object.entries(history.byApiKey)) {
    // Upstream identity is RAW_KEY|MODEL|PROVIDER. Never match masked keys or names.
    if (!identity.startsWith(apiKey.trim() + '|')) continue
    totalRequests += row.requests
    totalPromptTokens += row.promptTokens
    totalCompletionTokens += row.completionTokens
    const name = `${row.rawModel} (${row.provider})`
    const previous = models[name] ?? {
      requests: 0,
      promptTokens: 0,
      completionTokens: 0,
    }
    models[name] = {
      requests: previous.requests + row.requests,
      promptTokens: previous.promptTokens + row.promptTokens,
      completionTokens: previous.completionTokens + row.completionTokens,
    }
  }
  // Global recentRequests has no key identity, so it must never reach customers.
  return summarizeUsage({
    totalRequests,
    totalPromptTokens,
    totalCompletionTokens,
    byModel: models,
    recentRequests: [],
  })
}
