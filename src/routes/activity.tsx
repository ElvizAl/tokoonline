import { Suspense } from 'react'
import { Await, createFileRoute, redirect } from '@tanstack/react-router'
import { loadPageData } from '#/lib/route-data'
import { PageLoading } from '#/modules/dashboard/components/page-loading'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
import { getSessionServerFn } from '#/lib/auth/auth.session'
import { getAuditLogServerFn } from '#/modules/customers/customers.api'

export const Route = createFileRoute('/activity')({
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    if (session.user.role !== 'ADMIN') throw redirect({ to: '/' })
  },
  loader: () => loadPageData(() => getAuditLogServerFn()),
  head: () => ({ meta: [{ title: 'Riwayat aktivitas — Tokenmaxxing' }] }),
  component: Activity,
})
const labels: Record<string, string> = {
  CUSTOMER_CREATED: 'Pelanggan dibuat',
  API_KEY_CREATED: 'API key dibuat',
  KEY_LINK_CHANGED: 'Koneksi key diubah',
  PASSWORD_RESET: 'Password direset',
  QUOTA_CHANGED: 'Kuota diubah',
  ACCESS_CHANGED: 'Status / paket diubah',
  KEY_ENABLED: 'Key diaktifkan',
  KEY_BLOCKED: 'Key diblokir',
  KEY_REISSUED: 'Key pelanggan diganti',
}
function Activity() {
  const { data } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <PageLoading isAdmin active="activity" title="Riwayat aktivitas" />
      }
    >
      <Await promise={data}>
        {(pageData) => <ActivityContent pageData={pageData} />}
      </Await>
    </Suspense>
  )
}
function ActivityContent({
  pageData,
}: {
  pageData: Awaited<ReturnType<typeof getAuditLogServerFn>>
}) {
  const rows = pageData
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34] lg:pl-72">
      <DashboardSidebar isAdmin active="activity" />
      <main className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Riwayat aktivitas</h1>
        <p className="mt-3 mb-8 text-sm text-[#7a8980]">
          100 tindakan terbaru sejak pencatatan diaktifkan. Waktu ditampilkan
          dalam zona Fiji.
        </p>
        <section className="overflow-x-auto rounded-2xl border border-[#e1e7e3] bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e1e7e3] text-[#7a8980]">
                <th className="p-4">Waktu</th>
                <th className="p-4">Pelaku</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tindakan</th>
                <th className="p-4">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-[#edf0ed]">
                  <td className="whitespace-nowrap p-4 text-xs">
                    {new Intl.DateTimeFormat('id-ID', {
                      timeZone: 'Pacific/Fiji',
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(row.createdAt))}
                  </td>
                  <td className="p-4 text-xs">{row.actorEmail}</td>
                  <td className="p-4 text-xs">{row.targetEmail}</td>
                  <td className="p-4">{labels[row.action] ?? row.action}</td>
                  <td className="max-w-xs break-words p-4 text-xs text-[#7a8980]">
                    {describe(row.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="p-6 text-sm text-[#7a8980]">
              Belum ada tindakan tercatat.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

function describe(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '—'
  const d = value as Record<string, unknown>
  const parts: string[] = []
  if (typeof d.keyName === 'string') parts.push('Nama key: ' + d.keyName)
  if (typeof d.reason === 'string') parts.push(d.reason)
  if (typeof d.isActive === 'boolean')
    parts.push(d.isActive ? 'Akun aktif' : 'Akun nonaktif')
  if (typeof d.planName === 'string' && d.planName)
    parts.push('Paket: ' + d.planName)
  const limit = 'limit' in d ? d.limit : d.tokenQuota
  if (typeof limit === 'number')
    parts.push('Kuota: ' + new Intl.NumberFormat('id-ID').format(limit))
  if (limit === null) parts.push('Kuota tanpa batas')
  if (typeof d.accessExpiresAt === 'string')
    parts.push(
      'Aktif sampai ' +
        new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Pacific/Fiji',
          dateStyle: 'medium',
        }).format(new Date(d.accessExpiresAt)),
    )
  return parts.join(' · ') || 'Perubahan tersimpan'
}
