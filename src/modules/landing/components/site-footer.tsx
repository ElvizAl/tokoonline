import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Brand } from '#/components/brand'
import { Button } from '#/components/ui/button'

export function SiteFooter() {
  return (
    <>
      <section
        aria-labelledby="cta-title"
        className="mx-auto max-w-320 px-5 pb-16 sm:px-8 lg:px-10"
      >
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#dceebd] px-6 py-14 text-center sm:px-10 sm:py-17">
          <span
            aria-hidden="true"
            className="absolute top-8 left-8 hidden -rotate-12 text-[64px] leading-none font-light text-[#86a865] sm:block"
          >
            ✳
          </span>
          <p className="mb-5 inline-flex items-center gap-2 text-[9px] font-semibold tracking-[1.6px] text-[#668249]">
            <Sparkles size={13} aria-hidden="true" /> YOUR NEXT CHAPTER STARTS
            HERE
          </p>
          <h2
            id="cta-title"
            className="text-4xl leading-[1.1] font-semibold tracking-[-1.6px] sm:text-[50px]"
          >
            Bisnis kecilmu
            <br />
            punya cerita besar.
          </h2>
          <p className="mx-auto mt-5 max-w-80 text-xs leading-[1.9] text-[#72835f]">
            Yuk, kasih pelanggan cara baru untuk kenal, ngobrol, dan jatuh hati
            sama bisnismu.
          </p>
          <Button
            asChild
            className="mt-7 h-12 gap-8 rounded-xl bg-[#27583f] px-6 text-xs text-[#f4f9ec] hover:bg-[#1c432f]"
          >
            <Link to="/register">
              Mulai cerita bisnismu <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <span
            aria-hidden="true"
            className="absolute -right-12 -bottom-24 -z-10 size-72 rounded-full border border-[#b8cf96] shadow-[0_0_0_30px_#b8cf9622,0_0_0_60px_#b8cf9611]"
          />
        </div>
      </section>
      <footer className="mx-auto max-w-320 px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-7 border-t border-[#e2e7d9] py-9 sm:flex-row sm:items-center">
          <div>
            <Brand />
            <p className="mt-3 text-[11px] text-[#7b8870]">
              Little store. Big energy.
            </p>
          </div>
          <nav
            aria-label="Navigasi footer"
            className="flex flex-wrap gap-6 text-xs text-[#6e805e]"
          >
            <a href="#fitur" className="underline-offset-4 hover:underline">
              Fitur
            </a>
            <a
              href="#cara-kerja"
              className="underline-offset-4 hover:underline"
            >
              Cara kerja
            </a>
            <a href="#faq" className="underline-offset-4 hover:underline">
              FAQ
            </a>
            <Link to="/login" className="underline-offset-4 hover:underline">
              Masuk <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-[#e2e7d9] py-5 text-[9px] text-[#859078]">
          <span>© {new Date().getFullYear()} Tanyatoko</span>
          <span>
            Dibuat untuk bisnis dengan banyak mimpi{' '}
            <span className="ml-1 text-[#99ac7d]" aria-hidden="true">
              ✳
            </span>
          </span>
        </div>
      </footer>
    </>
  )
}
