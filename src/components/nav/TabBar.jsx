import { NavLink } from 'react-router-dom'
import { Home, BarChart3, Settings } from 'lucide-react'

const TABS = [
  { to: '/', label: 'วันนี้', Icon: Home, end: true },
  { to: '/report', label: 'รายงาน', Icon: BarChart3 },
  { to: '/settings', label: 'ตั้งค่า', Icon: Settings },
]

function TabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface-card"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <div className="mx-auto flex max-w-3xl">
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default TabBar
