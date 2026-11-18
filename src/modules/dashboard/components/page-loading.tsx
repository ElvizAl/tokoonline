import { DashboardSidebar } from './dashboard-sidebar'
export function PageLoading({
  isAdmin,
  active,
  title,
}: {
  isAdmin: boolean
  active: 'dashboard' | 'customers' | 'api-access' | 'activity'
  title: string
}) {
  return (
    <div className="min-h-svh bg-[#f6f8f7] px-5 py-10 text-[#243e34] lg:pl-72">
      <DashboardSidebar isAdmin={isAdmin} active={active} />
      <main className="mx-auto max-w-5xl" aria-busy="true">
        <h1 className="mb-8 text-3xl font-semibold">{title}</h1>
        <p role="status" className="mb-6 text-sm text-[#7a8980]">
          Memuat data…
        </p>
        <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((value) => (
            <div
              key={value}
              className="h-32 rounded-2xl border border-[#e1e7e3] bg-white motion-safe:animate-pulse"
            />
          ))}
        </div>
      </main>
    </div>
  )
}
