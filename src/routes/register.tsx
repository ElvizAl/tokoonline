import { createFileRoute } from '@tanstack/react-router'
import { AuthLayout } from '#/modules/auth/components/auth-layout'
import { RegisterForm } from '#/modules/auth/components/register-form'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Daftar — Tanyatoko' },
      {
        name: 'description',
        content:
          'Buat akun Tanyatoko. Beri ruang untuk ide dan bisnismu tumbuh bersama asisten AI.',
      },
    ],
  }),
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  )
}
