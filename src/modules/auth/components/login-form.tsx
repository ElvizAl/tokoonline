import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/button'
import { AuthField } from './auth-field'
import { AuthFormFeedback } from './auth-form-feedback'

export function LoginForm() {
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      'Form siap digunakan. Proses masuk belum diaktifkan pada pratinjau ini.',
    )
  }

  return (
    <form
      className="mt-8 space-y-5 lg:mt-7"
      onSubmit={handleSubmit}
      method="post"
    >
      <AuthField
        id="login-email"
        name="email"
        label="Email kamu"
        icon={Mail}
        type="email"
        placeholder="kamu@email.com"
        autoComplete="email"
        maxLength={254}
        required
      />
      <AuthField
        id="login-password"
        name="password"
        label="Kata sandi"
        icon={LockKeyhole}
        type="password"
        placeholder="Masukkan kata sandi"
        autoComplete="current-password"
        required
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] lg:text-[10px]">
        <span className="text-[#737e69]">
          Senang kamu balik lagi <span aria-hidden="true">✌️</span>
        </span>
        <button
          className="cursor-pointer font-medium text-[#4a6f3c] underline-offset-4 outline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#86a76b]"
          type="button"
          onClick={() =>
            setMessage(
              'Fitur pemulihan kata sandi belum diaktifkan pada pratinjau ini.',
            )
          }
        >
          Lupa kata sandi?
        </button>
      </div>
      <Button
        type="submit"
        className="h-13 w-full cursor-pointer justify-between rounded-[10px] bg-[#27583f] px-5 text-[13px] font-medium text-[#f4f9ec] shadow-sm hover:bg-[#1c432f] focus-visible:ring-[#6b8f60]/40 lg:text-xs"
      >
        Masuk ke Tanyatoko <ArrowRight size={18} aria-hidden="true" />
      </Button>
      <AuthFormFeedback message={message} />
    </form>
  )
}
