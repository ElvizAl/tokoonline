import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Menu } from 'lucide-react'
import { Brand } from '#/components/brand'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

const navigation = [
  { href: '#fitur', label: 'Kenapa Tanyatoko?' },
  { href: '#cara-kerja', label: 'Cara kerja' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e8dd]/80 bg-[#fafbf7]/95 backdrop-blur-md">
      <div className="mx-auto flex h-21 max-w-320 items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Brand />
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 text-xs font-medium text-[#687362] lg:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm underline-offset-4 outline-offset-4 hover:text-[#27583f] hover:underline focus-visible:outline-2 focus-visible:outline-[#86a76b]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Button
            asChild
            variant="ghost"
            className="h-10 px-4 text-xs text-[#36583e] hover:bg-[#eaf0e2]"
          >
            <Link to="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="h-10 gap-5 rounded-full bg-[#27583f] px-5 text-xs text-[#f4f9ec] hover:bg-[#1c432f]"
          >
            <Link to="/register">
              Mulai sekarang <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Buka menu navigasi"
              className="size-10 rounded-full border-[#dce3d3] bg-transparent text-[#27583f] lg:hidden"
            >
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#fafbf7] p-5 text-[#243e34]">
            <SheetHeader className="px-0 pt-8">
              <SheetTitle className="text-2xl text-[#243e34]">
                Kenalan, yuk.
              </SheetTitle>
              <SheetDescription>
                Temukan ruang baru untuk bisnismu.
              </SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Navigasi ponsel"
              className="mt-5 flex flex-col gap-2"
            >
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-xl px-3 py-4 font-medium hover:bg-[#e7efdf]"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-[#dce3d3] bg-transparent"
              >
                <Link to="/login" onClick={() => setOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-xl bg-[#27583f] text-[#f4f9ec] hover:bg-[#1c432f]"
              >
                <Link to="/register" onClick={() => setOpen(false)}>
                  Mulai sekarang <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
