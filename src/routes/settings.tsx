import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { getSessionServerFn } from '#/lib/auth/auth.session'
import { changeOwnPasswordServerFn } from '#/lib/auth/password.api'
import { DashboardSidebar } from '#/modules/dashboard/components/dashboard-sidebar'
export const Route = createFileRoute('/settings')({
  beforeLoad: async () => {
    const session = await getSessionServerFn()
    if (!session) throw redirect({ to: '/login' })
    return { user: session.user }
  },
  head: () => ({ meta: [{ title: 'Pengaturan akun — Tokenmaxxing' }] }),
  component: Settings,
})
function Settings() {
  const { user } = Route.useRouteContext()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('newPassword') !== data.get('confirm')) {
      setMessage('Konfirmasi password tidak sama.')
      return
    }
    setPending(true)
    try {
      const result = await changeOwnPasswordServerFn({
        data: {
          currentPassword: String(data.get('currentPassword')),
          newPassword: String(data.get('newPassword')),
        },
      })
      setMessage(result.message)
      if (result.success) form.reset()
    } catch {
      setMessage('Tidak dapat menyimpan. Silakan coba lagi.')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34] lg:pl-72">
      <DashboardSidebar isAdmin={user.role === 'ADMIN'} active="settings" />
      <main className="mx-auto max-w-2xl">
        <h1 className="mb-3 text-3xl font-semibold">Pengaturan akun</h1>
        <p className="mb-8 text-sm text-[#7a8980]">{user.email}</p>
        <section className="rounded-2xl border border-[#e1e7e3] bg-white p-6">
          <h2 className="font-semibold">Ganti password</h2>
          <form
            className="mt-5 space-y-5"
            onSubmit={submit}
            aria-busy={pending}
          >
            {[
              {
                name: 'currentPassword',
                label: 'Password saat ini',
                autoComplete: 'current-password',
                min: 1,
              },
              {
                name: 'newPassword',
                label: 'Password baru',
                autoComplete: 'new-password',
                min: 8,
              },
              {
                name: 'confirm',
                label: 'Konfirmasi password baru',
                autoComplete: 'new-password',
                min: 8,
              },
            ].map((field) => (
              <label key={field.name} className="block text-sm">
                {field.label}
                <input
                  name={field.name}
                  type="password"
                  required
                  minLength={field.min}
                  maxLength={128}
                  autoComplete={field.autoComplete}
                  className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none focus:ring-2 focus:ring-[#95ae82]"
                />
              </label>
            ))}
            <button
              disabled={pending}
              className="rounded-lg bg-[#27583f] px-5 py-3 text-sm text-white disabled:opacity-50"
            >
              {pending ? 'Menyimpan…' : 'Ganti password'}
            </button>
            <p role="status" className="text-sm">
              {message}
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}
