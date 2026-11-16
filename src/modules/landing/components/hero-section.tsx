import { Link } from '@tanstack/react-router'
import { ArrowDownRight, ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { StoreDemo } from './store-demo'

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-320 items-center gap-12 px-5 pt-12 pb-16 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-10 lg:pt-14 lg:pb-20">
      <div className="relative">
        <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#dce5ce] bg-[#f0f5e8] px-3.5 py-2 text-[9px] font-semibold tracking-[1.2px] text-[#60744e]">
          <Sparkles size={13} aria-hidden="true" /> SMALL BUSINESS, BIG ENERGY
        </p>
        <h1 className="max-w-160 text-[clamp(2.9rem,6vw,5rem)] leading-[1.04] font-semibold tracking-[-2.8px] text-[#243e34] sm:tracking-[-3.5px]">
          Toko kamu.
          <br />
          Cerita kamu.
          <br />
          <span className="relative isolate whitespace-nowrap after:absolute after:-right-1 after:bottom-1 after:-left-1 after:-z-10 after:h-4 after:-rotate-2 after:rounded-[50%] after:bg-[#d4eaa7] after:content-[''] sm:after:h-5">
            AI bantuin.
          </span>
          <span
            className="ml-3 inline-block rotate-12 align-top text-[45px] leading-none font-normal text-[#dc855e] sm:ml-5 sm:text-[64px]"
            aria-hidden="true"
          >
            ✳
          </span>
        </h1>
        <p className="mt-7 max-w-103 text-sm leading-[1.9] text-[#718068]">
          Satu halaman untuk mengenalkan bisnis, menjawab pertanyaan, dan
          membantu pelanggan lanjut memesan. Biar ide besarmu punya ruang untuk
          tumbuh.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="h-13 gap-7 rounded-xl bg-[#27583f] px-6 text-xs text-[#f4f9ec] shadow-[0_5px_12px_#27583f15] hover:bg-[#1c432f]"
          >
            <Link to="/register">
              Bikin halaman bisnismu{' '}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-13 gap-3 rounded-xl px-4 text-xs text-[#4e6842] hover:bg-[#eaf0e2]"
          >
            <a href="#demo">
              Coba asistennya <ArrowDownRight size={17} aria-hidden="true" />
            </a>
          </Button>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[10px] text-[#78856d]">
          {['Halaman bisnis', 'Katalog produk', 'Asisten AI'].map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <Check size={12} className="text-[#6a8c52]" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="relative isolate min-w-0 rounded-[32px] bg-[#e7efdf] bg-[radial-gradient(#a0b88d55_0.7px,transparent_0.7px)] bg-size-[17px_17px] px-4 pt-6 pb-4 sm:px-7 sm:pt-7 lg:px-5">
        <div
          className="pointer-events-none absolute top-16 -right-4 -z-10 size-32 rounded-full border border-[#cbdabd] shadow-[0_0_0_20px_#d3e3c633,0_0_0_40px_#d3e3c622]"
          aria-hidden="true"
        />
        <StoreDemo />
      </div>
    </section>
  )
}
