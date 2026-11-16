import {
  ArrowUpRight,
  Coffee,
  LayoutTemplate,
  MessageCircle,
  Palette,
  Scissors,
  Shirt,
  Sparkles,
} from 'lucide-react'
import { ProductArt } from './product-art'

export function FeaturesSection() {
  return (
    <>
      <div className="border-y border-[#e2e7d9] bg-[#f2f5ec]">
        <div className="mx-auto flex max-w-320 flex-col gap-7 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-xs leading-relaxed text-[#6f7e63]">
            Buat yang lagi ngerintis.
            <br />
            <strong className="font-semibold text-[#3f5c35]">
              Sampai yang siap naik kelas.
            </strong>
          </p>
          <div className="grid grid-cols-2 gap-x-7 gap-y-5 sm:flex sm:flex-wrap sm:gap-9">
            {[
              { icon: Shirt, label: 'Fashion & aksesori' },
              { icon: Coffee, label: 'Makanan & minuman' },
              { icon: Palette, label: 'Produk kreatif' },
              { icon: Scissors, label: 'Jasa & layanan' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2.5 text-[11px] font-medium text-[#687d57]"
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <section
        id="fitur"
        aria-labelledby="features-title"
        className="mx-auto max-w-320 scroll-mt-28 px-5 py-20 sm:px-8 lg:px-10 lg:py-25"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[1.8px] text-[#7a8d66]">
              LESS RIBET, MORE POSSIBILITIES
            </p>
            <h2
              id="features-title"
              className="mt-4 text-4xl leading-[1.12] font-semibold tracking-[-1.6px] sm:text-[46px]"
            >
              Link-nya satu.
              <br />
              Bisa bantu banyak.
            </h2>
          </div>
          <p className="max-w-77 text-[13px] leading-[1.8] text-[#77846b]">
            Kasih pelanggan tempat untuk kenalan lebih dekat, bukan sekadar
            lihat lalu lewat.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <article className="relative overflow-hidden rounded-3xl border border-[#e5decc] bg-[#f3eee3] p-7 sm:p-9">
            <span className="mb-5 grid size-10 place-items-center rounded-xl border border-[#e1d7c1] bg-[#faf7ee] text-[#9a815b]">
              <LayoutTemplate size={20} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="max-w-70 text-2xl font-semibold tracking-tight">
              Brand kamu, punya rumah sendiri.
            </h3>
            <p className="mt-3 max-w-80 text-xs leading-[1.9] text-[#8b826d]">
              Profil bisnis dan katalog dalam satu halaman yang mudah dibagikan.
              Biar produkmu punya panggungnya.
            </p>
            <div className="mt-8 ml-auto w-[88%] rotate-[-3deg] rounded-t-2xl border border-[#e5decc] bg-[#fffdfa] p-4 pb-0 shadow-[0_6px_30px_#6c5b3e08] sm:w-4/5">
              <div className="flex items-center justify-between border-b border-[#eee8dd] pb-3">
                <p className="font-serif text-lg text-[#7c725b]">
                  studio sehari.
                </p>
                <ArrowUpRight
                  size={16}
                  className="text-[#9a967f]"
                  aria-hidden="true"
                />
              </div>
              <div className="grid grid-cols-[1fr_0.85fr] items-center gap-4 pt-4">
                <div>
                  <span className="text-[7px] tracking-[1px] text-[#a39b84]">
                    LITTLE THINGS, BIG FEELINGS
                  </span>
                  <p className="mt-2 text-base leading-tight font-medium tracking-tight text-[#625e48]">
                    Teman baru
                    <br />
                    buat harimu.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-3 rounded-full bg-[#e9eddd] px-3 py-1.5 text-[8px] text-[#66754b]">
                    Kenali koleksi <ArrowUpRight size={10} aria-hidden="true" />
                  </span>
                </div>
                <ProductArt />
              </div>
              <p className="py-3 text-[7px] tracking-wide text-[#9c9b88]">
                ILUSTRASI HALAMAN BISNIS
              </p>
            </div>
          </article>
          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-[#294c38] p-7 text-[#edf3e4] sm:p-9">
            <span className="mb-5 grid size-10 place-items-center rounded-xl border border-[#567147] bg-[#385c40] text-[#d4eba9]">
              <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="max-w-77 text-2xl font-semibold tracking-tight">
              Pertanyaan kecil.
              <br />
              Selangkah lebih yakin.
            </h3>
            <p className="mt-3 max-w-80 text-xs leading-[1.9] text-[#b0c2a3]">
              Asisten AI bantu menjelaskan produk dan memberi arahan memesan.
              Pelanggan lebih paham sebelum menentukan pilihan.
            </p>
            <div
              className="relative mt-9 flex flex-1 flex-col items-start gap-3 pb-5"
              aria-hidden="true"
            >
              <span className="ml-3 -rotate-5 rounded-2xl rounded-bl-sm border border-[#8ca27855] bg-[#3c6045] px-4 py-3 text-[13px] text-[#e7efdd]">
                “Ini cocok buat hadiah?” <span className="ml-2">🎁</span>
              </span>
              <span className="ml-auto rotate-4 rounded-2xl rounded-br-sm bg-[#d5eaaa] px-4 py-3 text-[13px] text-[#3d5831]">
                “Bisa muat laptop, nggak?”
              </span>
              <span className="ml-6 -rotate-2 rounded-2xl rounded-bl-sm border border-[#8ca27855] bg-[#3c6045] px-4 py-3 text-[13px] text-[#e7efdd]">
                “Kalau mau pesan, gimana?” <span className="ml-2">👀</span>
              </span>
              <span className="absolute right-1 bottom-0 rotate-12 text-6xl text-[#dca16f]">
                ✳
              </span>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[10px] text-[#bdd2a5]">
              <Sparkles size={13} aria-hidden="true" /> Jawaban berangkat dari
              informasi bisnismu.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
