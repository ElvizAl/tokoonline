import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  MousePointer2,
  Sparkles,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ProductArt } from './product-art'

const scenarios = [
  {
    label: 'Cari produk',
    question: 'Cari tas buat ngampus, dong 👀',
    answer:
      'Everyday Tote cocok buat nemenin kamu! Muat laptop 14 inci, buku, dan barang harian.',
    tag: 'Rekomendasi buat kamu',
  },
  {
    label: 'Tanya detail',
    question: 'Bahannya apa? Ukurannya berapa?',
    answer:
      'Bahannya kanvas katun, warna Natural. Ukurannya 36 × 40 cm. Simpel, tapi muat banyak!',
    tag: 'Kenali produk lebih dekat',
  },
  {
    label: 'Lanjut pesan',
    question: 'Oke, aku mau pesan satu!',
    answer:
      'Pilihanmu sudah dirangkum. Satu Everyday Tote warna Natural, siap kamu lanjutkan ke penjual.',
    tag: 'Contoh ringkasan · belum dikirim',
  },
]

export function StoreDemo() {
  const [active, setActive] = useState(0)
  const scenario = scenarios[active]

  return (
    <div
      id="demo"
      className="relative scroll-mt-28 pt-6 pb-9 sm:px-4 lg:pt-9"
      aria-label="Demo interaktif asisten toko"
    >
      <div className="absolute top-0 right-3 z-10 flex rotate-5 items-center gap-2 rounded-full bg-[#d9f3a3] px-4 py-2.5 text-[11px] font-semibold shadow-sm sm:right-1">
        <Sparkles size={14} aria-hidden="true" /> Your new business bestie
      </div>
      <div className="relative mx-auto w-full max-w-112 -rotate-1 overflow-hidden rounded-3xl border border-[#d4dec9] bg-[#fffefa] shadow-[0_24px_70px_-28px_#35533855]">
        <div className="flex items-center gap-1.5 border-b border-[#e7eade] bg-[#f3f5ed] px-4 py-3">
          <span className="size-2 rounded-full bg-[#d5b5a1]" />
          <span className="size-2 rounded-full bg-[#dcd6ae]" />
          <span className="size-2 rounded-full bg-[#b6cba4]" />
          <span className="mx-auto pr-8 text-[9px] text-[#738069]">
            tanyatoko / studio-sehari
          </span>
        </div>
        <div className="flex items-center gap-3 border-b border-[#eeeee4] px-5 py-4">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edddc6] font-serif text-[31px] leading-none text-[#7c6747] italic"
            aria-hidden="true"
          >
            s<span className="sr-only">Studio Sehari</span>
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold tracking-tight">
              studio sehari<span className="text-[#a68e69]">.</span>
            </p>
            <p className="mt-1 text-[10px] text-[#79826f]">
              Barang sederhana. Cerita istimewa.
            </p>
          </div>
          <span className="rounded-full border border-[#dce5d0] px-2 py-1 text-[8px] font-medium tracking-wide text-[#6b8059]">
            TOKO CONTOH
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-[10px] text-[#78846c]">
            <span className="grid size-5 place-items-center rounded-full bg-[#e7efdb] text-[#557748]">
              <Sparkles size={12} aria-hidden="true" />
            </span>{' '}
            Kenalan sama asisten studio sehari
          </div>
          <div aria-live="polite" aria-atomic="true" className="min-h-75">
            <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-[#e7efdd] px-4 py-3 text-xs leading-relaxed">
              {scenario.question}
            </p>
            <div className="mt-4 flex items-start gap-2.5">
              <span
                className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#2f593e] text-[#e2f4c4]"
                aria-hidden="true"
              >
                <Sparkles size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-[1.8] text-[#5c6a53]">
                  {scenario.answer}
                </p>
                <div className="mt-3 rounded-2xl border border-[#e2e6d7] bg-white p-3">
                  <p className="mb-2.5 text-[8px] font-semibold tracking-[1.1px] text-[#76895e]">
                    {scenario.tag.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-3">
                    <ProductArt compact />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">Everyday Tote</p>
                      <p className="mt-1 text-[10px] text-[#7a8371]">
                        Natural
                        {active === 2 ? ' · Jumlah 1' : ' · Kanvas katun'}
                      </p>
                      <p className="mt-2 text-xs font-semibold">Rp129.000</p>
                    </div>
                    <ArrowUpRight
                      className="ml-auto hidden shrink-0 text-[#81956b] sm:block"
                      size={17}
                      aria-hidden="true"
                    />
                  </div>
                  {active === 2 && (
                    <p className="mt-3 flex items-center gap-1.5 border-t border-[#edf0e6] pt-2.5 text-[10px] text-[#537044]">
                      <Check size={12} aria-hidden="true" /> Contoh pilihan
                      produk, bukan pesanan sungguhan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-[#e9ecdf] pt-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-[9px] text-[#7b886e]">
              <MousePointer2 size={12} aria-hidden="true" /> Pilih untuk coba
              percakapannya
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {scenarios.map((item, index) => (
                <Button
                  key={item.label}
                  type="button"
                  variant="outline"
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                  className={`h-9 cursor-pointer rounded-full border-[#dbe3cf] px-1 text-[10px] font-medium shadow-none transition-colors motion-reduce:transition-none ${index === active ? 'border-[#345d3d] bg-[#345d3d] text-white hover:bg-[#294b31] hover:text-white' : 'bg-[#f8faf4] text-[#60724e] hover:bg-[#e8efde]'}`}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-0.5 left-2 flex -rotate-4 items-center gap-2 rounded-xl border border-[#e1d6c4] bg-[#fff7e9] px-4 py-3 text-[10px] font-medium shadow-[0_8px_20px_#4d513010] sm:left-0">
        <MessageCircle
          className="text-[#ae8059]"
          size={16}
          aria-hidden="true"
        />{' '}
        Dari “nanya dulu” jadi “mau!” <span aria-hidden="true">✦</span>
      </div>
      <p className="mt-6 text-center text-[9px] tracking-wide text-[#77866a]">
        DEMO INTERAKTIF · PRODUK & JAWABAN CONTOH
      </p>
    </div>
  )
}
