import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getSolQuotaServerFn } from './sol-quota.api'
import type { SolQuotaWindow } from './sol-quota.schema'

type Snapshot = Awaited<ReturnType<typeof getSolQuotaServerFn>>

export function SolQuotaTracker() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [pending, setPending] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    let loading = false
    async function load() {
      if (loading) return
      loading = true
      setPending(true)
      try {
        const result = await getSolQuotaServerFn()
        if (!cancelled) setSnapshot(result)
      } catch {
        if (!cancelled)
          setSnapshot({ status: 'error', accounts: [], checkedAt: null })
      } finally {
        loading = false
        if (!cancelled) setPending(false)
      }
    }
    void load()
    const poll = window.setInterval(() => {
      void load()
    }, 60_000)
    const tick = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => {
      cancelled = true
      window.clearInterval(poll)
      window.clearInterval(tick)
    }
  }, [refresh])

  return (
    <section
      aria-labelledby="sol-quota-title"
      className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-widest text-[#7a8980]">
            QUOTA TRACKER
          </p>
          <h2 id="sol-quota-title" className="mt-1 font-semibold">
            GPT-6 Sol
          </h2>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => setRefresh((value) => value + 1)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#dce4de] px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            aria-hidden="true"
            className={pending ? 'motion-safe:animate-spin' : ''}
          />
          {pending ? 'Memuat…' : 'Perbarui kuota'}
        </button>
      </div>
      <p className="mt-2 text-xs leading-5 text-[#7a8980]">
        Kuota bersama untuk akses GPT-6 Sol. Batas ini dipakai bersama pengguna
        dan model lain pada akun yang sama, bukan kuota pribadi atau per API
        key. Diperbarui setiap menit.
      </p>
      <div role="status" className="mt-3 text-xs text-[#7a8980]">
        {!snapshot && 'Mengambil kuota dari 9Router…'}
        {snapshot?.status === 'error' &&
          'Kuota belum dapat diambil dari 9Router. Coba perbarui lagi.'}
        {snapshot?.status === 'ready' &&
          snapshot.accounts.length === 0 &&
          'Belum ada akun Codex aktif di 9Router.'}
        {snapshot?.checkedAt &&
          `Terakhir diperiksa: ${formatDate(snapshot.checkedAt)}`}
      </div>
      {snapshot?.status === 'ready' && (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {snapshot.accounts.map((account) => (
            <article
              key={account.id}
              className="min-w-0 rounded-xl border border-[#e1e7e3] p-5"
            >
              <h3 className="truncate text-sm font-medium" title={account.name}>
                {account.name}
              </h3>
              <div className="mt-5 space-y-6">
                <QuotaWindow label="5 jam" quota={account.session} now={now} />
                <QuotaWindow
                  label="Mingguan"
                  quota={account.weekly}
                  now={now}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function formatDate(value: string) {
  return (
    new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Pacific/Fiji',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value)) + ' (Fiji)'
  )
}

function QuotaWindow({
  label,
  quota,
  now,
}: {
  label: string
  quota: SolQuotaWindow
  now: number
}) {
  const percent = quota
    ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(
        quota.usedPercent,
      )
    : null
  const remaining = quota?.resetAt ? Date.parse(quota.resetAt) - now : null
  const minutes =
    remaining !== null ? Math.max(1, Math.ceil(remaining / 60_000)) : 0
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const countdown = `${days ? `${days} hari ` : ''}${hours ? `${hours} jam ` : ''}${minutes % 60} menit`
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <h4 className="text-[#7a8980]">{label}</h4>
        <span className="font-medium tabular-nums">
          {percent === null ? 'Belum tersedia' : `${percent}% terpakai`}
        </span>
      </div>
      {quota && (
        <progress
          aria-label={`Kuota ${label} terpakai`}
          value={quota.usedPercent}
          max={100}
          className={`mt-3 block h-2 w-full ${quota.usedPercent >= 90 ? 'accent-amber-600' : 'accent-[#27583f]'}`}
        />
      )}
      <p className="mt-2 text-xs leading-5 text-[#7a8980]">
        {quota?.resetAt
          ? `Reset: ${formatDate(quota.resetAt)}`
          : 'Waktu reset belum tersedia dari provider.'}
      </p>
      {remaining !== null && (
        <p className="mt-1 text-xs text-[#7a8980]">
          {remaining > 0
            ? `Reset dalam ${countdown}`
            : 'Waktu reset telah lewat. Menunggu pembaruan provider.'}
        </p>
      )}
    </div>
  )
}
