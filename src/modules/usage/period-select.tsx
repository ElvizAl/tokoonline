import type { UsagePeriod } from './usage.options'
export function PeriodSelect({
  value,
  onChange,
}: {
  value: UsagePeriod
  onChange: (value: UsagePeriod) => void
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-[#7a8980]">
      Periode
      <select
        aria-label="Periode pemakaian"
        value={value}
        onChange={(event) => onChange(event.target.value as UsagePeriod)}
        className="h-10 rounded-lg border border-[#dce4de] bg-white px-3 text-[#243e34]"
      >
        <option value="today">Hari ini (zona waktu 9Router)</option>
        <option value="7d">7 hari terakhir</option>
        <option value="30d">30 hari terakhir</option>
        <option value="all">Semua waktu</option>
      </select>
    </label>
  )
}
