import { useRouterState } from '@tanstack/react-router'
export function NavigationProgress() {
  const pending = useRouterState({
    select: (state) => state.status === 'pending',
  })
  return pending ? (
    <div
      role="status"
      aria-label="Membuka halaman"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-[#dce8d6]"
    >
      <div className="h-full w-2/3 bg-[#27583f] motion-safe:animate-pulse" />
    </div>
  ) : null
}
