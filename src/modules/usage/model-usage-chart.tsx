import { Cpu } from 'lucide-react'
import type { summarizeUsage } from './usage.schema'
import type { UsagePeriod } from './usage.options'

const format = new Intl.NumberFormat('id-ID')
const percentage = new Intl.NumberFormat('id-ID', {
  style: 'percent',
  maximumFractionDigits: 1,
})
const periodLabels: Record<UsagePeriod, string> = {
  today: 'Hari ini (zona waktu 9Router)',
  '7d': '7 hari terakhir',
  '30d': '30 hari terakhir',
  all: 'Semua waktu',
}

export function ModelUsageChart({
  models,
  period,
  unavailableMessage,
}: {
  models: ReturnType<typeof summarizeUsage>['models'] | undefined
  period: UsagePeriod
  unavailableMessage: string
}) {
  const ranked = [...(models ?? [])].sort((a, b) => b.tokens - a.tokens)
  const total = ranked.reduce((sum, model) => sum + model.tokens, 0)
  const largest = ranked[0]?.tokens ?? 0

  return (
    <section
      aria-labelledby="model-usage-heading"
      className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Cpu size={19} className="text-[#789263]" aria-hidden="true" />
            <h2 id="model-usage-heading" className="font-semibold">
              Pemakaian per model
            </h2>
          </div>
          <p className="mt-2 text-xs leading-5 text-[#7a8980]">
            {periodLabels[period]} · Token input + output, dari pemakaian
            terbesar.
          </p>
        </div>
        {models && ranked.length > 0 && (
          <p className="text-right text-xs text-[#7a8980]">
            Total seluruh model
            <span className="mt-1 block text-lg font-semibold text-[#243e34] tabular-nums">
              {format.format(total)} token
            </span>
          </p>
        )}
      </div>
      {!models ? (
        <p className="mt-5 text-sm text-[#8a968e]">{unavailableMessage}</p>
      ) : ranked.length === 0 ? (
        <p className="mt-5 text-sm text-[#8a968e]">
          Belum ada pemakaian model pada periode ini.
        </p>
      ) : (
        <>
          <ol
            aria-label="Peringkat pemakaian token per model"
            className="mt-6 space-y-5"
          >
            {ranked.map((model, index) => (
              <li key={model.name}>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                  <span className="min-w-0 break-all font-medium">
                    {model.name}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {format.format(model.tokens)} token
                    <span className="ml-2 text-xs text-[#7a8980]">
                      ({percentage.format(total > 0 ? model.tokens / total : 0)}
                      )
                    </span>
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-4 overflow-hidden rounded-full bg-[#f0f4ed]"
                >
                  <div
                    className={`h-full rounded-full ${index === 0 ? 'bg-[#27583f]' : 'bg-[#91b578]'}`}
                    style={{
                      width: `${largest > 0 ? (model.tokens / largest) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-[#7a8980] tabular-nums">
                  {format.format(model.requests)} request
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-5 text-[#8a968e]">
            Panjang batang dibandingkan dengan model terbesar. Persentase
            menunjukkan bagian dari total token seluruh model.
          </p>
        </>
      )}
    </section>
  )
}
