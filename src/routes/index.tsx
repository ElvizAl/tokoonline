import { Suspense, useState } from 'react'
import {
  Await,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { loadPageData } from '#/lib/route-data'
import { PageLoading } from '#/modules/dashboard/components/page-loading'
import type { SearchSchemaInput } from '@tanstack/react-router'
import { PeriodSelect } from '#/modules/usage/period-select'
import { QuotaCard } from '#/modules/usage/quota-card'
import { SolQuotaTracker } from '#/modules/usage/sol-quota-tracker'
import { ModelUsageChart } from '#/modules/usage/model-usage-chart'
import { periodSchema } from '#/modules/usage/usage.options'
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Zap,
} from 'lucide-react'
import { getSessionServerFn, logoutServerFn } from '#/lib/auth/auth.session'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
import { getUsageServerFn } from '#/modules/usage/usage.api'

export const Route = createFileRoute('/')({
  validateSearch: (search: SearchSchemaInput & { period?: unknown }) => ({
    period: periodSchema.catch('all').parse(search.period),
  }),
  loaderDeps: ({ search }) => ({ period: search.period }),
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user }
  },
  loader: ({ deps }) => loadPageData(() => getUsageServerFn({ data: deps })),
  head: () => ({
    meta: [
      { title: 'Dashboard — Tokenmaxxing' },
      {
        name: 'description',
        content: 'Pantau pemakaian token dan aktivitas akun Tokenmaxxing kamu.',
      },
    ],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = Route.useRouteContext()
  const { data } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <PageLoading
          isAdmin={user.role === 'ADMIN'}
          active="dashboard"
          title="Dashboard"
        />
      }
    >
      <Await promise={data}>
        {(pageData) => <DashboardContent pageData={pageData} />}
      </Await>
    </Suspense>
  )
}
function DashboardContent({
  pageData,
}: {
  pageData: Awaited<ReturnType<typeof getUsageServerFn>>
}) {
  const { user } = Route.useRouteContext()
  const usage = pageData
  const { period } = Route.useSearch()
  const data = usage.data
  const format = (value: number | undefined) =>
    value === undefined ? '—' : new Intl.NumberFormat('id-ID').format(value)
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function logout() {
    setPending(true)
    setError('')
    try {
      await logoutServerFn()
      await navigate({ to: '/login' })
    } catch {
      setError('Gagal keluar. Silakan coba lagi.')
      setPending(false)
    }
  }
  const metrics = [
    {
      label: 'Total token',
      icon: Zap,
      detail: 'Seluruh token yang digunakan',
      value: data?.total,
    },
    {
      label: 'Token input',
      icon: ArrowUpRight,
      detail: 'Token dari pesan yang dikirim',
      value: data?.input,
    },
    {
      label: 'Token output',
      icon: ArrowDownLeft,
      detail: 'Token dari respons model',
      value: data?.output,
    },
    {
      label: 'Total request',
      icon: Activity,
      detail: 'Jumlah permintaan ke model',
      value: data?.requests,
    },
  ]
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#243e34] selection:bg-[#d4eaa7]">
      <DashboardSidebar isAdmin={user.role === 'ADMIN'} active="dashboard" />
      <div className="lg:pl-64">
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-[#e1e7e3] bg-white px-5 md:px-10">
          <span className="flex items-center gap-2 text-sm">
            <LayoutDashboard size={16} className="text-[#8a968e]" />
            <span className="hidden sm:inline">Workspace</span>
            <ChevronRight size={14} className="text-[#a3aea7]" />
            <span className="font-medium">Dashboard</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-xs font-medium">{user.name}</span>
              <span className="text-[11px] text-[#84938b]">
                {user.role === 'ADMIN' ? 'Administrator' : 'Akun pelanggan'}
              </span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#eaf0e4] text-sm font-semibold">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={logout}
              disabled={pending}
              aria-label={pending ? 'Sedang keluar' : 'Keluar dari akun'}
              className="cursor-pointer rounded-lg p-2 text-[#7a8980] hover:bg-[#f0f4ed] disabled:opacity-50"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-5 py-9 md:px-10 md:py-11">
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium tracking-widest text-[#7a8980]">
                OVERVIEW
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Halo, {user.name.split(' ')[0]}{' '}
                <span aria-hidden="true">✦</span>
              </h1>
              <p className="mt-3 text-sm text-[#7a8980]">{usage.message}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e1e7e3] bg-white px-3 py-2 text-xs text-[#7a8980]">
              <span
                className={`size-1.5 rounded-full ${usage.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-400'}`}
              />
              {usage.status === 'connected'
                ? 'Terhubung ke 9Router'
                : usage.status === 'error'
                  ? 'Koneksi bermasalah'
                  : 'Menunggu API key'}
            </span>
          </div>
          <div className="mb-5">
            <PeriodSelect
              value={period}
              onChange={(value) => {
                void navigate({ to: '/', search: { period: value } })
              }}
            />
          </div>
          <section
            aria-label="Ringkasan pemakaian"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {metrics.map(({ label, icon: Icon, detail, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e1e7e3] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#7a8980]">{label}</p>
                  <span className="rounded-lg bg-[#f2f6ee] p-2">
                    <Icon size={17} className="text-[#658450]" />
                  </span>
                </div>
                <p
                  className="mt-5 text-4xl font-medium tracking-tight"
                  aria-label={
                    value === undefined ? 'Data belum tersedia' : undefined
                  }
                >
                  {format(value)}
                </p>
                <p className="mt-3 text-xs text-[#8a968e]">{detail}</p>
              </div>
            ))}
          </section>
          <SolQuotaTracker />
          {user.role !== 'ADMIN' && (
            <>
              <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
                <h2 className="font-semibold">
                  Paket: {user.planName || 'Custom'}
                </h2>
                <p className="mt-2 text-sm text-[#7a8980]">
                  {user.accessExpiresAt
                    ? 'Masa aktif sampai ' +
                      new Intl.DateTimeFormat('id-ID', {
                        timeZone: 'Pacific/Fiji',
                        dateStyle: 'long',
                      }).format(new Date(user.accessExpiresAt))
                    : 'Tanpa tanggal berakhir'}
                </p>
                {user.accessExpiresAt &&
                  new Date(user.accessExpiresAt) <= new Date() && (
                    <p className="mt-2 text-sm text-amber-700">
                      Masa aktif berakhir. Hubungi admin untuk perpanjangan.
                    </p>
                  )}
              </section>
              <QuotaCard quota={usage.quota} />
            </>
          )}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
            <section className="overflow-hidden rounded-2xl border border-[#e1e7e3] bg-white">
              <div className="border-b border-[#edf0ed] p-6">
                <h2 className="font-semibold">Aktivitas pemakaian</h2>
                <p className="mt-1 text-xs text-[#8a968e]">
                  {data
                    ? user.role === 'ADMIN'
                      ? '20 request terbaru · semua waktu · seluruh pelanggan'
                      : 'Aktivitas akun kamu'
                    : 'Ringkasan token dari request kamu'}
                </p>
              </div>
              {data && data.recent.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8faf7] text-[#7a8980]">
                      <tr>
                        <th className="p-4">Waktu (Fiji)</th>
                        <th className="p-4">Model</th>
                        <th className="p-4 text-right">Token</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent.map((row, index) => (
                        <tr key={index} className="border-t border-[#edf0ed]">
                          <td className="whitespace-nowrap p-4">
                            {Number.isNaN(Date.parse(row.timestamp))
                              ? '—'
                              : new Intl.DateTimeFormat('id-ID', {
                                  timeZone: 'Pacific/Fiji',
                                  dateStyle: 'short',
                                  timeStyle: 'short',
                                }).format(new Date(row.timestamp))}
                          </td>
                          <td className="p-4">{row.model}</td>
                          <td className="p-4 text-right tabular-nums">
                            {format(row.tokens)}
                          </td>
                          <td className="p-4">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
                  <Activity size={28} className="mb-5 text-[#789263]" />
                  <h3 className="text-sm font-medium">
                    {data
                      ? user.role === 'ADMIN'
                        ? 'Belum ada aktivitas'
                        : 'Riwayat request belum tersedia'
                      : 'Data pemakaian belum tersedia'}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-[#8a968e]">
                    {data
                      ? user.role === 'ADMIN'
                        ? 'Request terbaru akan tampil di sini.'
                        : 'Ringkasan token dan per model tersedia. Riwayat request per key belum disediakan 9Router.'
                      : usage.message}
                  </p>
                </div>
              )}
            </section>
            <section className="rounded-2xl bg-[#27583f] p-6 text-white">
              <span className="inline-flex rounded-xl bg-white/10 p-3 text-[#d4eaa7]">
                <KeyRound size={23} />
              </span>
              <h2 className="mt-5 text-lg font-medium">Koneksi akun</h2>
              <p className="mt-2 text-xs leading-6 text-[#d1dfd4]">
                {data
                  ? user.role === 'ADMIN'
                    ? 'Koneksi admin aktif. Dashboard ini menampilkan pemakaian seluruh pelanggan.'
                    : 'API key terhubung. Data ini hanya mencakup pemakaian key milik akun kamu.'
                  : 'Pemakaian pelanggan tersedia setelah API key dihubungkan oleh admin.'}
              </p>
              <div className="mt-6 border-t border-white/15 pt-5">
                <p className="text-[10px] tracking-widest text-[#b8cfbd]">
                  STATUS KONEKSI
                </p>
                <p className="mt-2 text-sm">
                  {data
                    ? user.role === 'ADMIN'
                      ? 'Terhubung · akses admin'
                      : 'API key terhubung'
                    : 'Belum tersedia'}
                </p>
              </div>
              <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-[#d1dfd4]">
                <CircleHelp size={16} className="mt-0.5 shrink-0" />
                {data
                  ? 'Data dimuat saat halaman dibuka. Muat ulang untuk memperbarui.'
                  : usage.message}
              </p>
            </section>
          </div>
          <ModelUsageChart
            models={data?.models}
            period={period}
            unavailableMessage={usage.message}
          />
          <footer className="mt-8 flex flex-wrap justify-between gap-2 text-[11px] text-[#8a968e]">
            <span>Tokenmaxxing · Dashboard pelanggan</span>
            <span className="break-all">Masuk sebagai {user.email}</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
