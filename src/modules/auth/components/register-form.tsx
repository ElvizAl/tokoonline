import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/button'
import { AuthField } from './auth-field'
import { AuthFormFeedback } from './auth-form-feedback'

export function RegisterForm() {
  const [message, setMessage] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  function validatePasswords(form: HTMLFormElement) {
    const password = form.elements.namedItem('password') as HTMLInputElement
    const confirmation = form.elements.namedItem(
      'confirmPassword',
    ) as HTMLInputElement
    const mismatch =
      confirmation.value.length > 0 && confirmation.value !== password.value

    confirmation.setCustomValidity(
      mismatch ? 'Konfirmasi kata sandi harus sama dengan kata sandi.' : '',
    )
    setPasswordMismatch(mismatch)
    return !mismatch
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validatePasswords(event.currentTarget)) {
      event.currentTarget.reportValidity()
      return
    }
    setMessage(
      'Form siap digunakan. Pembuatan akun belum diaktifkan pada pratinjau ini.',
    )
  }

  return (
    <form
      className="mt-8 space-y-5 lg:mt-7"
      onSubmit={handleSubmit}
      onInput={(event) => {
        setMessage('')
        validatePasswords(event.currentTarget)
      }}
      method="post"
    >
      <AuthField
        id="register-name"
        name="name"
        label="Kenalan dulu, nama kamu?"
        icon={UserRound}
        placeholder="Nama lengkap kamu"
        autoComplete="name"
        minLength={2}
        maxLength={100}
        required
      />
      <AuthField
        id="register-email"
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
        id="register-password"
        name="password"
        label="Bikin kata sandi"
        icon={LockKeyhole}
        type="password"
        placeholder="Buat kata sandi yang kuat"
        autoComplete="new-password"
        minLength={8}
        hint="Minimal 8 karakter. Bikin yang susah ditebak, ya."
        required
      />
      <AuthField
        id="register-confirm-password"
        name="confirmPassword"
        label="Konfirmasi kata sandi"
        icon={LockKeyhole}
        type="password"
        placeholder="Ulangi kata sandi kamu"
        autoComplete="new-password"
        minLength={8}
        aria-invalid={passwordMismatch}
        hint={
          passwordMismatch
            ? 'Konfirmasi kata sandi harus sama dengan kata sandi.'
            : undefined
        }
        required
      />
      <Button
        type="submit"
        className="h-13 w-full cursor-pointer justify-between rounded-[10px] bg-[#27583f] px-5 text-[13px] font-medium text-[#f4f9ec] shadow-sm hover:bg-[#1c432f] focus-visible:ring-[#6b8f60]/40 lg:text-xs"
      >
        Bikin akun Tanyatoko <ArrowRight size={18} aria-hidden="true" />
      </Button>
      <AuthFormFeedback message={message} />
    </form>
  )
}
