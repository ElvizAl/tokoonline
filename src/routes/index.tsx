import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '#/modules/landing/components/site-header'
import { HeroSection } from '#/modules/landing/components/hero-section'
import { FeaturesSection } from '#/modules/landing/components/features-section'
import { HowItWorks } from '#/modules/landing/components/how-it-works'
import { FaqSection } from '#/modules/landing/components/faq-section'
import { SiteFooter } from '#/modules/landing/components/site-footer'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Tanyatoko — Toko kamu. Cerita kamu. AI bantuin.' },
      {
        name: 'description',
        content:
          'Halaman bisnis dengan asisten AI yang membantu pengunjung mengenal produk, mendapatkan jawaban, dan melanjutkan pemesanan. Little store. Big energy.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div className="overflow-x-clip bg-[#fafbf7] text-[#243e34] selection:bg-[#d4eaa7] selection:text-[#243e34]">
      <a
        href="#konten"
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-[#27583f] px-4 py-3 text-sm text-white focus:not-sr-only"
      >
        Lewati ke konten
      </a>
      <SiteHeader />
      <main id="konten" tabIndex={-1} className="outline-none">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <FaqSection />
        <SiteFooter />
      </main>
    </div>
  )
}
