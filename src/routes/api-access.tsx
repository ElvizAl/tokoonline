import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Copy, Eye, EyeOff, KeyRound } from 'lucide-react'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
import { getSessionServerFn } from '#/lib/auth/auth.session'
import {
  getApiAccessServerFn,
  revealOwnApiKeyServerFn,
} from '#/modules/api-access/access.api'
export const Route = createFileRoute('/api-access')({
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    if (session.user.role === 'ADMIN') throw redirect({ to: '/' })
    return { user: session.user }
  },
  loader: () => getApiAccessServerFn(),
  head: () => ({
    meta: [
      { title: 'Akses API — Tokenmaxxing' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: ApiAccess,
})
function ApiAccess() {
  const data = Route.useLoaderData()
  const [revealed, setRevealed] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const models = data.models.filter((model) =>
    model.toLowerCase().includes(search.toLowerCase()),
  )
  async function keyAction(copy: boolean) {
    if (pending) return
    if (!copy && revealed) {
      setRevealed(null)
      return
    }
    setPending(true)
    setMessage('')
    try {
      const result = await revealOwnApiKeyServerFn()
      if (!result.success) {
        setMessage(result.message)
        return
      }
      if (copy) {
        await navigator.clipboard.writeText(result.key)
        setMessage('API key disalin.')
      } else setRevealed(result.key)
    } catch {
      setMessage(
        'Tidak dapat menampilkan atau menyalin key. Silakan coba lagi.',
      )
    } finally {
      setPending(false)
    }
  }
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setMessage(label + ' disalin.')
    } catch {
      setMessage('Tidak dapat menyalin. Silakan salin teks secara manual.')
    }
  }
  const button =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-[#dce4de] px-3 py-2 text-xs hover:bg-[#f6f8f7] disabled:opacity-50'
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34]">
      <DashboardSidebar isAdmin={false} active="api-access" />
      <main className="mx-auto max-w-4xl lg:ml-64 lg:pl-8">
        <p className="text-xs tracking-widest text-[#7a8980]">TOKENMAXXING</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Akses API
        </h1>
        <p className="mt-3 mb-8 text-sm text-[#7a8980]">
          Hubungkan aplikasi kamu dengan API key dan model yang tersedia untuk
          akunmu.
        </p>
        {data.message && (
          <p
            role="status"
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            {data.message}
          </p>
        )}
        <section className="rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <KeyRound size={18} />
              API key kamu
            </h2>
            {data.status === 'linked' && (
              <span
                className={`rounded-full px-3 py-1 text-xs ${data.keyActive ? 'bg-[#edf4e8] text-[#27583f]' : 'bg-amber-50 text-amber-800'}`}
              >
                {data.keyActive ? 'Aktif' : 'Nonaktif'}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-[#7a8980]">
            {data.keyName || 'Key pribadi akun kamu'}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 break-all rounded-lg bg-[#f6f8f7] p-4 text-sm select-all">
              {revealed ?? data.maskedKey ?? 'Belum dihubungkan'}
            </code>
            {data.maskedKey && (
              <div className="flex gap-2">
                <button
                  className={button}
                  type="button"
                  disabled={pending}
                  onClick={() => keyAction(false)}
                >
                  {revealed ? <EyeOff size={15} /> : <Eye size={15} />}{' '}
                  {revealed ? 'Sembunyikan' : 'Tampilkan'}
                </button>
                <button
                  className={button}
                  type="button"
                  disabled={pending}
                  onClick={() => keyAction(true)}
                >
                  <Copy size={15} />
                  Salin key
                </button>
              </div>
            )}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#7a8980]">
            Simpan key ini di aplikasi milikmu. Jangan membagikannya kepada
            orang lain.
          </p>
        </section>
        <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <h2 className="font-semibold">Base URL</h2>
          <p className="mt-2 text-xs text-[#7a8980]">
            Pakai URL ini pada aplikasi yang mendukung API OpenAI-compatible.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 break-all rounded-lg bg-[#f6f8f7] p-4 text-sm select-all">
              {data.baseUrl || 'Belum tersedia'}
            </code>
            {data.baseUrl && (
              <button
                className={button}
                type="button"
                onClick={() => copy(data.baseUrl, 'Base URL')}
              >
                <Copy size={15} />
                Salin URL
              </button>
            )}
          </div>
        </section>
        <p role="status" aria-live="polite" className="mt-4 text-sm">
          {message}
        </p>
        <section className="mt-6 rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                Model tersedia{' '}
                <span className="font-normal text-[#7a8980]">
                  ({data.models.length})
                </span>
              </h2>
              <p className="mt-2 text-xs text-[#7a8980]">
                Gunakan ID model persis seperti yang tercantum.
              </p>
            </div>
            <input
              aria-label="Cari model"
              placeholder="Cari model…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#dce4de] px-3 text-sm sm:w-60"
            />
          </div>
          <div className="mt-5 divide-y divide-[#edf0ed]">
            {models.length ? (
              models.map((model) => (
                <div
                  key={model}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <code className="min-w-0 break-all text-sm">{model}</code>
                  <button
                    type="button"
                    className={button}
                    aria-label={'Salin model ' + model}
                    onClick={() => copy(model, 'ID model')}
                  >
                    <Copy size={14} />
                    <span className="hidden sm:inline">Salin</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="py-5 text-sm text-[#7a8980]">
                {search
                  ? 'Model tidak ditemukan.'
                  : 'Belum ada model yang dapat ditampilkan.'}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
