import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { loginSchema } from '../auth.schema'
import { loginServerFn } from '../auth.api'
import { LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '#/components/ui/button'
import { AuthField } from './auth-field'
import { AuthFormFeedback } from './auth-form-feedback'

export function LoginForm() {
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = new FormData(event.currentTarget)
    const result = loginSchema.safeParse({
      email: form.get('email'),
      password: form.get('password'),
    })
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? 'Periksa isian kamu.')
      return
    }
    setPending(true)
    setMessage('')
    try {
      const response = await loginServerFn({ data: result.data })
      setMessage(response.message)
      if (response.success) await navigate({ to: '/' })
    } catch {
      setMessage('Tidak dapat terhubung. Silakan coba lagi.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit}
      method="post"
      aria-busy={pending}
    >
      <AuthField
        id="login-email"
        name="email"
        label="Email"
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
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full cursor-pointer gap-2 rounded-[10px] bg-[#27583f] px-5 text-sm font-medium text-[#f4f9ec] shadow-none hover:bg-[#1c432f] focus-visible:ring-[#6b8f60]/40"
      >
        {pending && (
          <LoaderCircle
            size={16}
            className="animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {pending ? 'Sedang masuk…' : 'Masuk'}
      </Button>
      <AuthFormFeedback message={message} />
    </form>
  )
}
