import { Link } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'

export function AuthBrand() {
  return (
    <Link
      to="/"
      className="inline-flex items-center text-[23px] font-bold tracking-[-1.3px] text-[#243e34] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#86a76b] sm:text-[26px]"
      aria-label="Tanyatoko, beranda"
    >
      <span
        className="relative mr-2 grid size-9 -rotate-7 place-items-center rounded-xl bg-[#27583f] text-[#e2f7b2] sm:mr-2.5 sm:size-10"
        aria-hidden="true"
      >
        <MessageCircle size={23} strokeWidth={2.5} />
        <span className="absolute top-[13px] left-[14px] size-[3px] rounded-full bg-current shadow-[6px_0_currentColor] sm:top-[15px] sm:left-[16px]" />
      </span>
      tanyatoko<span className="text-[#76a35b]">.</span>
    </Link>
  )
}
