import { useAuthStore } from '../../store/useAuthStore'

// Login is optional (see SyncStatusBadge) — this just waits for Firebase Auth's
// cached-session check to resolve before rendering, so a guest-mode store load()
// doesn't race a real signed-in session that just hasn't reported back yet.
function AuthGate({ children }) {
  const initialized = useAuthStore((state) => state.initialized)

  if (!initialized) return null
  return children
}

export default AuthGate
