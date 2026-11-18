import type { quotaSummary } from './usage.options'
export function QuotaCard({
  quota,
}: {
  quota: ReturnType<typeof quotaSummary> | null
}) {
  const format = (value: number) => new Intl.NumberFormat('id-ID').format(value)
  return (
    <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
      <h2 className="font-semibold">Kuota token · 30 hari berjalan</h2>
      <p className="mt-2 text-xs leading-5 text-[#7a8980]">
        Input + output selama 30 hari. Key diblokir saat kuota habis, dengan
        pemeriksaan setiap 30 detik selama server aktif. Request berjalan dapat
        melewati batas.
      </p>
      {quota ? (
        <>
          <p className="mt-4 text-sm">
            Terpakai: <strong>{format(quota.used)}</strong> /{' '}
            {quota.limit === null ? 'Tanpa batas' : format(quota.limit)} token
          </p>
          {quota.limit !== null && (
            <>
              <progress
                aria-label="Pemakaian kuota token"
                value={Math.min(quota.used, quota.limit)}
                max={quota.limit || 1}
                className="mt-4 h-2 w-full accent-[#27583f]"
              />
              <p
                className={`mt-2 text-sm ${quota.exceeded ? 'text-amber-700' : 'text-[#7a8980]'}`}
              >
                {quota.exceeded
                  ? 'Kuota telah tercapai atau terlampaui.'
                  : `Sisa ${format(quota.remaining ?? 0)} token`}
              </p>
            </>
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-[#7a8980]">
          Pemakaian kuota belum tersedia.
        </p>
      )}
    </section>
  )
}
