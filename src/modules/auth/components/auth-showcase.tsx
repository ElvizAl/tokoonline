import { ArrowUpRight, Check, MoveUpRight, Sparkles } from 'lucide-react'

export function AuthShowcase({ register }: { register: boolean }) {
  return (
    <aside
      className="relative isolate hidden min-h-170 flex-col justify-between overflow-hidden rounded-[26px] border border-[#dce9d9] bg-[#e7f0df] bg-[radial-gradient(#9eb39155_0.7px,transparent_0.7px)] bg-size-[18px_18px] px-8 pt-11 pb-7 lg:flex xl:px-12 2xl:min-h-185 2xl:pt-14"
      aria-label="Kenalan dengan Tanyatoko"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.8px]">
          <span className="size-1.5 rounded-full bg-[#457449] shadow-[0_0_0_4px_#45744912]" />{' '}
          YOUR BUSINESS, BUT SMARTER
        </div>
        <h1 className="relative mt-6 w-fit text-[50px] leading-[1.05] font-semibold tracking-[-3px] xl:text-[62px] 2xl:text-[66px]">
          {register ? 'Ide kecil.' : 'Toko kamu.'}
          <br />
          <span className="relative isolate after:absolute after:-right-1 after:bottom-0.5 after:-left-1 after:-z-10 after:h-3.5 after:-rotate-2 after:rounded-[50%] after:bg-[#c4df99] after:content-['']">
            {register ? 'Potensi besar.' : 'Makin hidup.'}
          </span>
          <span
            className="absolute top-0 -right-12 rotate-12 text-[54px] font-normal text-[#e88654] xl:-right-15 xl:text-[68px]"
            aria-hidden="true"
          >
            ✳
          </span>
        </h1>
        <p className="mt-5 max-w-83 text-[13px] leading-[1.8] text-[#62745e]">
          Kenalin produk, jawab pertanyaan, sampai bantu pesanan. Asisten AI
          kamu siap nemenin.
        </p>
      </div>

      <div
        className="relative z-10 mx-auto my-8 w-full max-w-91.5 -rotate-3 rounded-[19px] border border-white bg-[#fffefa] shadow-[0_18px_45px_-22px_#344e3e66,0_2px_5px_#344e3e08] 2xl:my-11"
        aria-label="Contoh percakapan asisten toko"
      >
        <div className="flex items-center gap-2.5 border-b border-[#eeeee7] px-4 py-3.5">
          <div
            className="relative grid size-9 place-items-center rounded-xl bg-[#eed9c0] font-serif text-[29px] leading-none text-[#594b37] italic"
            aria-hidden="true"
          >
            s
            <span className="absolute top-0.5 right-1 text-xs text-[#ae714b]">
              ✳
            </span>
          </div>
          <div className="flex-1">
            <strong className="block text-xs font-semibold">
              studio sehari
            </strong>
            <span className="mt-1 flex items-center gap-1 text-[9px] text-[#6f7c6c]">
              <i className="size-1.5 rounded-full bg-[#70a66a]" /> Asisten toko
              siap bantu
            </span>
          </div>
          <ArrowUpRight
            className="text-[#7c8b73]"
            size={20}
            aria-hidden="true"
          />
        </div>
        <div className="px-4 pt-3 pb-4">
          <span className="mb-3 block text-center text-[7px] tracking-[1.4px] text-[#6f796b]">
            CONTOH PERCAKAPAN
          </span>
          <div className="ml-auto w-4/5 rounded-xl rounded-br-sm bg-[#e8efdf] px-3 py-2.5 text-[11px] leading-relaxed">
            Cari tas buat ngampus, ada rekomendasi? <span>👀</span>
          </div>
          <div className="mt-4 flex items-start gap-2">
            <span
              className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e5eddb] text-[#426438]"
              aria-hidden="true"
            >
              <Sparkles size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="max-w-58 text-[11px] leading-relaxed">
                Ada dong! Ini cocok buat nemenin hari-hari kamu ✨
              </p>
              <div className="mt-2.5 flex items-center gap-3 rounded-[10px] border border-[#e6e8de] bg-white p-2.5">
                <div
                  className="grid h-21 w-17 shrink-0 place-items-center overflow-hidden rounded-md bg-[#e9e8df]"
                  aria-hidden="true"
                >
                  <div className="relative mt-3.5 grid h-12 w-11 -rotate-8 place-items-center rounded-b-lg border border-[#c0bda0] bg-linear-95 from-[#c7c3a2] via-[#e5dfc3] to-[#bdb89a] shadow-[3px_6px_8px_#45482c22] before:absolute before:-top-4.5 before:left-2.5 before:h-6.5 before:w-5.5 before:rounded-t-xl before:border-3 before:border-b-0 before:border-[#c5c0a4] before:content-['']">
                    <span className="font-serif text-[9px] text-[#596043]">
                      sehari.
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-[6px] tracking-[0.9px] text-[#6e795e]">
                    YOUR EVERYDAY PLUS ONE
                  </span>
                  <strong className="mt-1 block text-xs font-semibold">
                    Everyday Tote
                  </strong>
                  <span className="mt-1 block text-[8px] text-[#818575]">
                    Natural · muat laptop 14”
                  </span>
                  <b className="mt-1.5 block text-[11px] font-semibold">
                    Rp129.000
                  </b>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-md bg-[#edf2e6] px-2.5 py-2 text-[9px] text-[#426439]">
                Mau yang ini? Yuk, lanjut pesan{' '}
                <MoveUpRight size={14} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-3 mb-3 flex items-center justify-between rounded-lg border border-[#e5e8df] py-2 pr-2 pl-3 text-[9px] text-[#7a8473]">
          <span>Tanya apa aja tentang toko ini...</span>
          <span
            className="grid size-6 place-items-center rounded-md bg-[#315b3e] text-[#e8f6d4]"
            aria-hidden="true"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>

      <div className="absolute right-4 bottom-23 z-20 flex rotate-6 items-center gap-2 rounded-[10px] border border-[#d4e7aa] bg-[#dbf5b0] px-3.5 py-2.5 text-[10px] font-semibold shadow-[0_6px_12px_#4b5c3220] 2xl:right-10 2xl:bottom-27">
        <span
          className="grid size-5.5 place-items-center rounded-full bg-[#355a37] text-[#daf0b1]"
          aria-hidden="true"
        >
          <Check size={15} strokeWidth={3} />
        </span>{' '}
        Dari “nanya dulu” jadi “mau!”
      </div>
      <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] text-[#5e7256]">
        <Sparkles size={16} aria-hidden="true" />
        <span>Kamu bangun bisnisnya. AI bantu ceritainnya.</span>
      </div>
      <span
        className="absolute -bottom-40 -left-30 -z-10 size-110 rounded-full border border-[#cadbbb] shadow-[0_0_0_35px_#d2e3c433,0_0_0_70px_#d2e3c422]"
        aria-hidden="true"
      />
    </aside>
  )
}
