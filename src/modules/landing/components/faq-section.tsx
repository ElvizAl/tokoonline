import { MessageCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'

const questions = [
  {
    question: 'Tanyatoko itu apa, sih?',
    answer:
      'Tanyatoko adalah halaman bisnis dengan asisten AI. Pengunjung bisa mengenal bisnis, melihat produk, bertanya, lalu mendapatkan arahan untuk melanjutkan pemesanan dalam satu alur.',
  },
  {
    question: 'Cocok untuk bisnis seperti apa?',
    answer:
      'Mulai dari fashion, aksesori, produk kreatif, makanan, sampai jasa. Intinya, bisnis yang ingin membantu pelanggan memahami produk atau layanannya lewat percakapan.',
  },
  {
    question: 'AI dapat informasi produk dari mana?',
    answer:
      'Dari informasi yang disiapkan pemilik bisnis, seperti katalog, detail produk, dan pertanyaan umum. Karena itu, informasi yang jelas dan lengkap jadi bagian penting dari pengalaman pelanggan.',
  },
  {
    question: 'Apakah AI menggantikan pemilik bisnis?',
    answer:
      'AI berperan sebagai asisten untuk mengenalkan produk dan menjawab pertanyaan. Pemilik bisnis tetap menjadi sumber informasi dan pihak yang menangani keputusan serta kebutuhan pelanggan lebih lanjut.',
  },
  {
    question: 'Demo di halaman ini bisa membuat pesanan?',
    answer:
      'Belum. Demo ini memakai produk dan jawaban contoh untuk memperlihatkan alurnya. Tidak ada pesan yang dikirim, akun yang dibuat, atau pesanan yang diproses dari demo.',
  },
]

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mx-auto grid max-w-320 scroll-mt-28 gap-9 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-22 lg:px-10 lg:py-25"
    >
      <div>
        <span className="mb-5 grid size-11 -rotate-6 place-items-center rounded-2xl border border-[#e6d9c5] bg-[#f5eddf] text-[#b28b60]">
          <MessageCircle size={22} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="text-[10px] font-semibold tracking-[1.8px] text-[#7a8d66]">
          MASIH PENASARAN?
        </p>
        <h2
          id="faq-title"
          className="mt-4 text-4xl leading-[1.12] font-semibold tracking-[-1.5px] sm:text-[42px]"
        >
          Nanya dulu
          <br />
          juga boleh.
        </h2>
        <p className="mt-5 max-w-60 text-xs leading-[1.9] text-[#78866c]">
          Beberapa hal yang mungkin lagi ada di pikiran kamu.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="border-t border-[#dde4d3]"
      >
        {questions.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`question-${index}`}
            className="border-[#dde4d3]"
          >
            <AccordionTrigger className="cursor-pointer items-center gap-5 rounded-none py-6 text-[13px] leading-relaxed text-[#3d5832] hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="h-auto! max-w-125 pb-6 text-xs leading-[1.9] text-[#78866c]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
