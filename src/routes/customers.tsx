import { useState } from 'react'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { getSessionServerFn } from '#/lib/auth/auth.session'
import {
  createCustomerServerFn,
  getCustomersServerFn,
  linkCustomerServerFn,
} from '#/modules/customers/customers.api'

export const Route = createFileRoute('/customers')({
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    if (session.user.role !== 'ADMIN') throw redirect({ to: '/' })
  },
  loader: () => getCustomersServerFn(),
  head: () => ({ meta: [{ title: 'Pelanggan — Tokenmaxxing' }] }),
  component: CustomersPage,
})
const field =
  'mt-2 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#95ae82]'
type KeyOption = { id: string; name: string }
function CustomersPage() {
  const { customers, keys, message: loadMessage } = Route.useLoaderData()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const assigned = new Set(customers.map((customer) => customer.routerKeyId))
  const available = keys.filter((key) => !assigned.has(key.id))
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const fields = new FormData(form)
    setPending(true)
    setMessage('')
    try {
      const result = await createCustomerServerFn({
        data: {
          name: String(fields.get('name')),
          email: String(fields.get('email')),
          password: String(fields.get('password')),
          routerKeyId: String(fields.get('routerKeyId')),
        },
      })
      setMessage(result.message)
      if (result.success) {
        form.reset()
        await router.invalidate()
      }
    } catch {
      setMessage('Gagal menyimpan. Periksa isian dan coba lagi.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34] lg:pl-72">
      <DashboardSidebar isAdmin active="customers" />
      <main className="mx-auto max-w-5xl">
        <Link to="/" className="text-sm text-[#658450] hover:underline">
          ← Kembali ke dashboard
        </Link>
        <div className="mt-8 mb-8">
          <p className="text-xs tracking-widest text-[#7a8980]">
            TOKENMAXXING · ADMIN
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Pelanggan
          </h1>
          <p className="mt-3 text-sm text-[#7a8980]">
            Buat akses pelanggan dan hubungkan API key milik mereka.
          </p>
        </div>
        {loadMessage && (
          <p role="alert" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm">
            {loadMessage}
          </p>
        )}
        <section className="rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <h2 className="font-semibold">Tambah pelanggan</h2>
          <form
            onSubmit={create}
            aria-busy={pending}
            className="mt-5 grid gap-5 sm:grid-cols-2"
          >
            <label className="text-sm">
              Nama
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="off"
                className={field}
              />
            </label>
            <label className="text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="off"
                className={field}
              />
            </label>
            <label className="text-sm">
              Password awal
              <input
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                className={field}
              />
              <span className="mt-1 block text-xs text-[#7a8980]">
                Minimal 8 karakter.
              </span>
            </label>
            <label className="text-sm">
              API key pelanggan
              <select
                name="routerKeyId"
                required
                defaultValue=""
                className={field}
              >
                <option value="" disabled>
                  Pilih API key
                </option>
                {available.map((key) => (
                  <option key={key.id} value={key.id}>
                    {key.name || 'Key tanpa nama'}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs text-[#7a8980]">
                Hanya key aktif yang belum digunakan pelanggan.
              </span>
            </label>
            <div className="sm:col-span-2">
              <button
                disabled={pending || available.length === 0}
                className="h-11 cursor-pointer rounded-lg bg-[#27583f] px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? 'Menyimpan…' : 'Buat akun pelanggan'}
              </button>
              <p role="status" className="mt-3 text-sm">
                {message}
              </p>
            </div>
          </form>
        </section>
        <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <h2 className="font-semibold">
            Daftar pelanggan{' '}
            <span className="text-[#7a8980]">({customers.length})</span>
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#7a8980]">
            Pelanggan masuk lewat /login. Usage mengikuti key yang terhubung,
            termasuk pemakaian key sebelum akun dibuat. Mengganti key akan
            mengganti data yang terlihat.
          </p>
          <div className="mt-5 divide-y divide-[#edf0ed]">
            {customers.length ? (
              customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  keys={keys.filter(
                    (key) =>
                      key.id === customer.routerKeyId || !assigned.has(key.id),
                  )}
                />
              ))
            ) : (
              <p className="py-6 text-sm text-[#7a8980]">
                Belum ada pelanggan. Buat akun pertama lewat form di atas.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
function CustomerRow({
  customer,
  keys,
}: {
  customer: {
    id: string
    name: string
    email: string
    routerKeyId: string | null
    isActive: boolean
  }
  keys: KeyOption[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState(customer.routerKeyId ?? '')
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  async function save() {
    setPending(true)
    setMessage('')
    try {
      const result = await linkCustomerServerFn({
        data: { userId: customer.id, routerKeyId: selected || null },
      })
      setMessage(result.message)
      if (result.success) await router.invalidate()
    } catch {
      setMessage('Gagal menyimpan koneksi.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="py-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/customer/$customerId"
            params={{ customerId: customer.id }}
            search={{ period: 'all' }}
            className="text-sm font-medium text-[#27583f] hover:underline"
          >
            {customer.name} → Detail
          </Link>
          <p className="mt-1 text-xs text-[#7a8980]">
            {customer.email} · {customer.isActive ? 'Aktif' : 'Nonaktif'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label={`API key untuk ${customer.email}`}
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="h-10 max-w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm"
          >
            <option value="">Tidak dihubungkan</option>
            {customer.routerKeyId &&
              !keys.some((key) => key.id === customer.routerKeyId) && (
                <option value={customer.routerKeyId}>
                  Key tidak aktif / tidak tersedia
                </option>
              )}
            {keys.map((key) => (
              <option key={key.id} value={key.id}>
                {key.name || 'Key tanpa nama'}
              </option>
            ))}
          </select>
          <button
            onClick={save}
            disabled={pending || selected === (customer.routerKeyId ?? '')}
            className="cursor-pointer rounded-lg border border-[#dce4de] px-4 py-2 text-xs disabled:opacity-40"
          >
            {pending ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
      <p role="status" className="mt-2 text-xs">
        {message}
      </p>
    </div>
  )
}
