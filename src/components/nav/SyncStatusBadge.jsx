import { Cloud, CloudOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

// Mounted once in MainLayout, in normal document flow above each page's own header —
// the ONLY path into /login. Login is opt-in for cross-device sync, never a forced
// gate (see AuthGate). Deliberately NOT `fixed`: an earlier floating-corner version
// overlapped page headers (e.g. Dashboard's month label) and looked broken.
function SyncStatusBadge() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  if (user) {
    return (
      <button
        type="button"
        onClick={() => navigate('/settings')}
        aria-label="ซิงค์ข้ามเครื่องอยู่"
        className="flex items-center justify-center rounded-full bg-surface-card p-1.5 text-primary shadow-sm"
      >
        <Cloud size={14} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/login')}
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 text-xs text-text-secondary shadow-sm"
    >
      <CloudOff size={12} />
      ซิงค์ข้ามเครื่อง
    </button>
  )
}

export default SyncStatusBadge
