import { createFileRoute } from '@tanstack/react-router'
import { Radio } from 'lucide-react'
import { LoginForm } from '#/modules/auth/components/login-form'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Masuk — Tokenmaxxing' },
      {
        name: 'description',
        content: 'Masuk untuk melihat pemakaian token akun Tokenmaxxing kamu.',
      },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col bg-[#fafbf9] px-6 text-[#243e34]">
      <main className="flex flex-1 items-center justify-center py-16">
        <section aria-labelledby="login-title" className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#27583f] text-[#e3efcf]">
              <Radio size={20} aria-hidden="true" />
            </span>
            Tokenmaxxing
          </div>
          <h1
            id="login-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Masuk ke akun kamu
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#7a8980]">
            Pantau pemakaian token dalam satu tempat.
          </p>
          <LoginForm />
          <p className="mt-7 text-center text-xs leading-5 text-[#8a968e]">
            Belum punya akun? Hubungi admin untuk mendapatkan akses.
          </p>
        </section>
      </main>
      <footer className="pb-7 text-center text-[11px] text-[#9aa49d]">
        Tokenmaxxing · Customer Portal
      </footer>
    </div>
  )
}
