import { Link } from '@tanstack/react-router'
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  Radio,
  ShieldCheck,
  Users,
  Settings,
  History,
  KeyRound,
} from 'lucide-react'

export function DashboardSidebar({
  isAdmin,
  active,
}: {
  isAdmin: boolean
  active: 'dashboard' | 'customers' | 'settings' | 'activity' | 'api-access'
}) {
  function navigation() {
    return (
      <nav aria-label="Menu workspace" className="space-y-1">
        {[
          {
            to: '/' as const,
            name: 'Dashboard',
            icon: LayoutDashboard,
            page: 'dashboard',
          },
          ...(!isAdmin
            ? [
                {
                  to: '/api-access' as const,
                  name: 'Akses API',
                  icon: KeyRound,
                  page: 'api-access',
                },
              ]
            : []),
          ...(isAdmin
            ? [
                {
                  to: '/customers' as const,
                  name: 'Kelola pelanggan',
                  icon: Users,
                  page: 'customers',
                },
              ]
            : []),
          ...(isAdmin
            ? [
                {
                  to: '/activity' as const,
                  name: 'Riwayat aktivitas',
                  icon: History,
                  page: 'activity',
                },
              ]
            : []),
          {
            to: '/settings' as const,
            name: 'Pengaturan akun',
            icon: Settings,
            page: 'settings',
          },
        ].map(({ to, name, icon: Icon, page }) => (
          <Link
            key={to}
            to={to}
            aria-current={active === page ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${active === page ? 'bg-[#edf4e8] text-[#27583f]' : 'text-[#7a8980] hover:bg-[#f6f8f7] hover:text-[#27583f]'}`}
          >
            <Icon size={18} aria-hidden="true" />
            {name}
            {active === page && (
              <ChevronRight className="ml-auto" size={15} aria-hidden="true" />
            )}
          </Link>
        ))}
      </nav>
    )
  }
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#e1e7e3] bg-white p-6 lg:flex">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight"
        >
          <span className="rounded-xl bg-[#27583f] p-2 text-[#d4eaa7]">
            <Radio size={23} aria-hidden="true" />
          </span>
          Tokenmaxxing
        </Link>
        <p className="mt-12 mb-3 text-[10px] font-semibold tracking-[0.18em] text-[#89968f]">
          WORKSPACE
        </p>
        {navigation()}
        <div className="mt-auto rounded-2xl border border-[#e1e7e3] bg-[#f8faf7] p-4">
          <ShieldCheck
            size={22}
            className="mb-3 text-[#658450]"
            aria-hidden="true"
          />
          <p className="text-sm font-medium">Ruang pribadi kamu</p>
          <p className="mt-2 text-xs leading-5 text-[#7a8980]">
            Pantau pemakaian dan aktivitas akunmu dalam satu tempat.
          </p>
        </div>
        <p className="mt-5 text-xs text-[#8a968e]">
          Tokenmaxxing Customer Portal
        </p>
      </aside>
      <details className="border-b border-[#e1e7e3] bg-white p-4 lg:hidden">
        <summary className="cursor-pointer text-sm font-medium">
          <Menu size={16} aria-hidden="true" className="mr-2 inline" />
          Menu Tokenmaxxing
        </summary>
        <div className="mt-3">{navigation()}</div>
      </details>
    </>
  )
}
