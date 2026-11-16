import { ArrowUpRight, Link2, PackagePlus, Store } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Store,
    title: 'Kenalin bisnismu',
    description:
      'Mulai dari nama, cerita, dan informasi yang bikin bisnismu jadi kamu banget.',
  },
  {
    number: '02',
    icon: PackagePlus,
    title: 'Isi produk & infonya',
    description:
      'Siapkan katalog, detail produk, dan jawaban yang perlu diketahui pelanggan.',
  },
  {
    number: '03',
    icon: Link2,
    title: 'Bagikan, mulai obrolan',
    description:
      'Taruh link di bio atau bagikan ke pelanggan. Biarkan percakapan jadi awal pesanan.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="cara-kerja"
      aria-labelledby="steps-title"
      className="scroll-mt-28 border-y border-[#e2e8d8] bg-[#f0f4e9]"
    >
      <div className="mx-auto max-w-320 px-5 py-18 sm:px-8 lg:px-10 lg:py-22">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[1.8px] text-[#778b62]">
              DARI IDE KE HALAMAN BISNIS
            </p>
            <h2
              id="steps-title"
              className="mt-4 text-4xl leading-tight font-semibold tracking-[-1.5px] sm:text-[42px]"
            >
              Mulainya nggak harus ribet.
            </h2>
          </div>
          <ArrowUpRight
            className="hidden text-[#9caf84] sm:block"
            size={36}
            strokeWidth={1}
            aria-hidden="true"
          />
        </div>
        <ol className="mt-12 grid gap-9 md:grid-cols-3 md:gap-10">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li key={number} className="border-t border-[#d2ddc6] pt-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#91a37c]">
                  / {number}
                </span>
                <Icon
                  size={23}
                  strokeWidth={1.3}
                  className="text-[#6e8957]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 max-w-77 text-xs leading-[1.9] text-[#78866c]">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
