import { Suspense } from 'react'
import { Await } from '@tanstack/react-router'
import { loadPageData } from '#/lib/route-data'
import { PageLoading } from '#/modules/dashboard/components/page-loading'
import { CustomerAccessPanel } from '#/modules/customers/customer-access-panel'
import type { SearchSchemaInput } from '@tanstack/react-router'
import { useState } from 'react'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
import { getSessionServerFn } from '#/lib/auth/auth.session'
import {
  getCustomerDetailServerFn,
  resetCustomerPasswordServerFn,
  saveCustomerQuotaServerFn,
} from '#/modules/customers/customers.api'
import { periodSchema } from '#/modules/usage/usage.options'
import { PeriodSelect } from '#/modules/usage/period-select'
import { QuotaCard } from '#/modules/usage/quota-card'

export const Route = createFileRoute('/customer/$customerId')({
  validateSearch: (search: SearchSchemaInput & { period?: unknown }) => ({
    period: periodSchema.catch('all').parse(search.period),
  }),
  loaderDeps: ({ search }) => ({ period: search.period }),
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    if (session.user.role !== 'ADMIN') throw redirect({ to: '/' })
  },
  loader: ({ params, deps }) =>
    loadPageData(() =>
      getCustomerDetailServerFn({
        data: { userId: params.customerId, period: deps.period },
      }),
    ),
  head: () => ({ meta: [{ title: 'Detail pelanggan — Tokenmaxxing' }] }),
  component: CustomerDetail,
})
const field =
  'mt-2 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#95ae82]'
function CustomerDetail() {
  const { data } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <PageLoading isAdmin active="customers" title="Detail pelanggan" />
      }
    >
      <Await promise={data}>
        {(pageData) => <CustomerContent pageData={pageData} />}
      </Await>
    </Suspense>
  )
}
function CustomerContent({
  pageData,
}: {
  pageData: Awaited<ReturnType<typeof getCustomerDetailServerFn>>
}) {
  const { customer, usage, quota, message } = pageData
  const { period } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()
  const [resetPending, setResetPending] = useState(false)
  const [quotaPending, setQuotaPending] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [quotaMessage, setQuotaMessage] = useState('')
  const format = (value: number | undefined) =>
    value === undefined ? '—' : new Intl.NumberFormat('id-ID').format(value)
  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (resetPending) return
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('password') !== data.get('confirmPassword')) {
      setResetMessage('Konfirmasi password tidak sama.')
      return
    }
    setResetPending(true)
    setResetMessage('')
    try {
      const result = await resetCustomerPasswordServerFn({
        data: { userId: customer.id, password: String(data.get('password')) },
      })
      setResetMessage(result.message)
      if (result.success) form.reset()
    } catch {
      setResetMessage('Gagal mereset password. Coba lagi.')
    } finally {
      setResetPending(false)
    }
  }
  async function saveQuota(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (quotaPending) return
    const raw = String(
      new FormData(event.currentTarget).get('limit') ?? '',
    ).trim()
    setQuotaPending(true)
    setQuotaMessage('')
    try {
      const result = await saveCustomerQuotaServerFn({
        data: { userId: customer.id, limit: raw === '' ? null : Number(raw) },
      })
      setQuotaMessage(result.message)
      if (result.success) await router.invalidate()
    } catch {
      setQuotaMessage('Gagal menyimpan. Periksa nilai kuota.')
    } finally {
      setQuotaPending(false)
    }
  }
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34] lg:pl-72">
      <DashboardSidebar isAdmin active="customers" />
      <main className="mx-auto max-w-5xl">
        <Link
          to="/customers"
          className="text-sm text-[#658450] hover:underline"
        >
          ← Daftar pelanggan
        </Link>
        <header className="my-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs tracking-widest text-[#7a8980]">
              DETAIL PELANGGAN
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{customer.name}</h1>
            <p className="mt-2 text-sm text-[#7a8980]">{customer.email}</p>
          </div>
          <PeriodSelect
            value={period}
            onChange={(value) => {
              void navigate({
                to: '/customer/$customerId',
                params: { customerId: customer.id },
                search: { period: value },
              })
            }}
          />
        </header>
        {message && (
          <p role="alert" className="mb-6 rounded-xl bg-amber-50 p-4 text-sm">
            {message}
          </p>
        )}
        <section
          aria-label="Pemakaian pelanggan"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            { label: 'Total token', value: usage?.total },
            { label: 'Token input', value: usage?.input },
            { label: 'Token output', value: usage?.output },
            { label: 'Total request', value: usage?.requests },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[#e1e7e3] bg-white p-5"
            >
              <p className="text-xs text-[#7a8980]">{metric.label}</p>
              <p className="mt-4 text-2xl font-semibold">
                {format(metric.value)}
              </p>
            </div>
          ))}
        </section>
        <QuotaCard quota={quota} />
        <CustomerAccessPanel
          key={`${customer.id}-${customer.isActive}-${customer.planName}-${customer.tokenQuota}-${customer.accessExpiresAt}`}
          customer={customer}
        />
        <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <h2 className="font-semibold">Pemakaian per model</h2>
          {usage?.models.length ? (
            <div className="mt-4 divide-y divide-[#edf0ed]">
              {usage.models.map((model) => (
                <div
                  key={model.name}
                  className="flex flex-wrap justify-between gap-3 py-4 text-sm"
                >
                  <span>{model.name}</span>
                  <span className="text-[#7a8980]">
                    {format(model.requests)} request · {format(model.tokens)}{' '}
                    token
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#7a8980]">
              Belum ada data model pada periode ini.
            </p>
          )}
        </section>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-[#e1e7e3] bg-white p-6">
            <h2 className="font-semibold">Atur kuota token</h2>
            <p className="mt-2 text-xs leading-5 text-[#7a8980]">
              Berlaku untuk 30 hari berjalan pada key yang terhubung, termasuk
              pemakaian sebelum akun dibuat. Kosongkan untuk tanpa batas. Kuota
              akan memblokir API key setelah sinkronisasi.
            </p>
            <form
              className="mt-5 space-y-4"
              onSubmit={saveQuota}
              aria-busy={quotaPending}
            >
              <label className="block text-sm">
                Batas token
                <input
                  key={customer.tokenQuota ?? 'unlimited'}
                  type="number"
                  name="limit"
                  min={0}
                  max={2147483647}
                  step={1}
                  defaultValue={customer.tokenQuota ?? ''}
                  className={field}
                  placeholder="Tanpa batas"
                />
              </label>
              <button
                disabled={quotaPending}
                className="rounded-lg bg-[#27583f] px-4 py-3 text-sm text-white disabled:opacity-50"
              >
                {quotaPending ? 'Menyimpan…' : 'Simpan kuota'}
              </button>
              <p role="status" className="text-sm">
                {quotaMessage}
              </p>
            </form>
          </section>
          <section className="rounded-2xl border border-[#e1e7e3] bg-white p-6">
            <h2 className="font-semibold">Reset password</h2>
            <p className="mt-2 text-xs leading-5 text-[#7a8980]">
              Semua sesi login pelanggan akan diakhiri setelah password
              diperbarui.
            </p>
            <form
              className="mt-5 space-y-4"
              onSubmit={resetPassword}
              aria-busy={resetPending}
            >
              <label className="block text-sm">
                Password baru
                <input
                  name="password"
                  type="password"
                  minLength={8}
                  maxLength={128}
                  required
                  autoComplete="new-password"
                  className={field}
                />
              </label>
              <label className="block text-sm">
                Konfirmasi password
                <input
                  name="confirmPassword"
                  type="password"
                  minLength={8}
                  maxLength={128}
                  required
                  autoComplete="new-password"
                  className={field}
                />
              </label>
              <button
                disabled={resetPending}
                className="rounded-lg border border-[#dce4de] px-4 py-3 text-sm disabled:opacity-50"
              >
                {resetPending ? 'Memperbarui…' : 'Reset password'}
              </button>
              <p role="status" className="text-sm">
                {resetMessage}
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
