import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useEntriesStore } from '../store/useEntriesStore'
import { useMedicationsStore } from '../store/useMedicationsStore'
import { useDiagnosesStore } from '../store/useDiagnosesStore'
import { signOutUser } from '../lib/auth'
import ThemeToggle from '../components/settings/ThemeToggle'
import LinkPasswordForm from '../components/settings/LinkPasswordForm'

function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const hasPasswordLinked = user?.providerData?.some((p) => p.providerId === 'password') ?? true

  async function handleSignOut() {
    if (!window.confirm('ออกจากระบบใช่ไหม?')) return
    // Reset the read-through caches before signing out — otherwise their onSnapshot
    // listeners fire against a session that no longer has permission to read. Reload
    // as a guest only after signOutUser() resolves, so load() sees the cleared session.
    useEntriesStore.getState().reset()
    useMedicationsStore.getState().reset()
    useDiagnosesStore.getState().reset()
    await signOutUser()
    useEntriesStore.getState().load()
    useMedicationsStore.getState().load()
    useDiagnosesStore.getState().load()
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-text-primary">ตั้งค่า</h1>
      </header>

      {user ? (
        <section className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-card p-3">
          <div className="flex min-w-0 items-center gap-3">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="h-10 w-10 shrink-0 rounded-full" referrerPolicy="no-referrer" />
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-text-primary">{user.displayName ?? 'ผู้ใช้'}</div>
              <div className="truncate text-xs text-text-secondary">{user.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="ออกจากระบบ"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-severity-3-text"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </section>
      ) : (
        <section className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-card p-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-text-primary">ยังไม่ได้ซิงค์ข้ามเครื่อง</div>
            <div className="text-xs text-text-secondary">ข้อมูลอยู่ในเครื่องนี้เครื่องเดียว</div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
          >
            <LogIn size={16} />
            เข้าสู่ระบบ
          </button>
        </section>
      )}

      {user && !hasPasswordLinked && user.email && (
        <section className="mt-3">
          <LinkPasswordForm email={user.email} />
        </section>
      )}

      <section className="mt-8 flex flex-col gap-3">
        <h2 className="text-sm font-medium text-text-secondary">ธีม</h2>
        <ThemeToggle />
      </section>
    </div>
  )
}

export default SettingsPage
