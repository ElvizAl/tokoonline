import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '#/modules/auth/components/auth-layout'
import { LoginForm } from '#/modules/auth/components/login-form'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Masuk — Tanyatoko' },
      {
        name: 'description',
        content: 'Masuk ke Tanyatoko dan mulai cerita baru untuk bisnismu.',
      },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  )
}
