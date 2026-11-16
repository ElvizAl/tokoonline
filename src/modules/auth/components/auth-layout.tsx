import { Link } from '@tanstack/react-router'
import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import type { ReactNode } from 'react'
import { AuthBrand } from './auth-brand'
import { AuthShowcase } from './auth-showcase'
import { Button } from '#/components/ui/button'

export function AuthLayout({
  mode,
  children,
}: {
  mode: 'login' | 'register'
  children: ReactNode
}) {
  const register = mode === 'register'

  return (
    <div className="flex min-h-svh flex-col bg-[#fafbf7] px-5 text-[#243e34] sm:px-7 lg:px-10">
      <header className="mx-auto flex h-22 w-full max-w-350 shrink-0 items-center justify-between gap-5 lg:h-25 2xl:h-30">
        <AuthBrand />
        <nav
          aria-label="Navigasi akun"
          className="flex items-center gap-3.5 text-xs sm:text-[13px]"
        >
          <span className="hidden text-[#737c75] sm:inline">
            {register ? 'Sudah punya akun?' : 'Baru di sini?'}
          </span>
          <Button
            asChild
            variant="outline"
            className="h-auto gap-2 rounded-full border-[#d5ddd2] bg-transparent px-3.5 py-2.5 text-xs text-[#243e34] hover:bg-[#eaf1e5] sm:gap-3 sm:px-4"
          >
            <Link to={register ? '/login' : '/register'}>
              {register ? 'Masuk' : 'Yuk, daftar'}{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-350 flex-1 grid-cols-1 lg:flex-none lg:grid-cols-[1.04fr_1fr]">
        <AuthShowcase register={register} />
        <section
          className="flex items-center justify-center px-2 py-12 sm:px-9 sm:py-14 lg:px-10 lg:py-10"
          aria-labelledby="auth-title"
        >
          <div
            className="w-full max-w-97.5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 lg:max-w-90"
            key={mode}
          >
            <span className="text-[10px] font-semibold tracking-[2px] text-[#657653] lg:text-[9px]">
              {register ? 'BIG IDEAS START HERE' : 'GOOD TO SEE YOU AGAIN'}
            </span>
            <h2
              id="auth-title"
              className="mt-4 text-[48px] leading-[1.09] font-semibold tracking-[-2px] sm:text-[50px] lg:text-[46px] xl:text-[48px]"
            >
              {register ? (
                <>
                  Mulai ceritamu
                  <br />
                  di sini
                  <span
                    className="ml-3 inline-block align-[5px] text-[32px] text-[#dc855e]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                </>
              ) : (
                <>
                  Hai, ketemu
                  <br />
                  lagi
                  <span
                    className="ml-3 inline-block align-[5px] text-[32px] text-[#dc855e]"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                </>
              )}
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-[#737c75] lg:text-xs">
              {register
                ? 'Bikin akun, kasih ruang buat bisnismu tumbuh.'
                : 'Masuk dulu, yuk. Ada ide besar yang nunggu kamu.'}
            </p>
            {children}
            <p className="mt-6 text-center text-xs text-[#737c68] lg:text-[11px]">
              {register
                ? 'Sudah jadi bagian Tanyatoko? '
                : 'Belum punya akun? '}
              <Link
                className="inline-flex items-center gap-0.5 font-semibold text-[#365e30] underline-offset-4 outline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#86a76b]"
                to={register ? '/login' : '/register'}
              >
                {register ? 'Masuk di sini' : 'Bikin akun dulu'}{' '}
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </p>
            <p className="mt-7 flex items-center justify-center gap-1.5 text-[10px] text-[#737c68] lg:text-[9px]">
              <LockKeyhole size={12} aria-hidden="true" /> Pratinjau UI ·
              autentikasi belum diaktifkan
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex min-h-16 w-full max-w-350 items-center justify-between gap-4 border-t border-[#e7eade] text-[9px] text-[#737c68] lg:min-h-18 lg:border-0 lg:text-[10px]">
        <span>© {new Date().getFullYear()} Tanyatoko</span>
        <span className="hidden items-center gap-1.5 lg:flex">
          Dibuat untuk bisnis dengan banyak mimpi{' '}
          <span className="text-base text-[#829b61]" aria-hidden="true">
            ✳
          </span>
        </span>
        <span>Little store. Big energy.</span>
      </footer>
    </div>
  )
}
