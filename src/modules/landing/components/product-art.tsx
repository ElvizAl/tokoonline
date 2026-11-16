export function ProductArt({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative grid overflow-hidden rounded-2xl bg-[#eae7d9] ${compact ? 'size-18 shrink-0' : 'aspect-square w-full'}`}
    >
      <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
        <ellipse cx="125" cy="206" rx="61" ry="9" fill="#bdb89b" opacity=".3" />
        <g transform="rotate(-9 120 125)">
          <path
            d="M91 100V66c0-40 58-40 58 0v34"
            fill="none"
            stroke="#b5ad8d"
            strokeWidth="9"
          />
          <path
            d="M91 100V66c0-40 58-40 58 0v34"
            fill="none"
            stroke="#d9d0b1"
            strokeWidth="5"
          />
          <path
            d="M66 88h109l9 108q-54 17-125-1z"
            fill="#d4ccac"
            stroke="#b9af8c"
            strokeWidth="1.5"
          />
          <path d="m66 88 12 101 96 7-115-1z" fill="#b5ad8f" opacity=".45" />
          <path
            d="m72 91 8 94m89-94 6 97"
            fill="none"
            stroke="#eee6cb"
            strokeWidth="1"
          />
          <text
            x="91"
            y="146"
            fill="#4e5d40"
            fontSize="19"
            fontFamily="Georgia, serif"
          >
            sehari.
          </text>
          <text
            x="91"
            y="160"
            fill="#687253"
            fontSize="4.5"
            letterSpacing="1.2"
          >
            MADE FOR EVERY DAY
          </text>
        </g>
      </svg>
    </div>
  )
}
