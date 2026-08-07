import { create } from 'zustand'
import { captureLinkableCredential, resolveRedirectResult, subscribeAuthState } from '../lib/auth'
import { migrateLocalDataIfNeeded } from '../lib/migrateLocalData'

// Synchronous-at-module-load init, same pattern as useThemeStore — Firebase Auth's own
// listener fires with the cached local session before any network round-trip, so
// `initialized` flips true almost immediately even offline.
export const useAuthStore = create(() => ({
  user: null,
  initialized: false,
  authError: null,
}))

let migratedForUid = null

resolveRedirectResult().catch((err) => {
  captureLinkableCredential(err)
  console.error('resolveRedirectResult failed', err)
  useAuthStore.setState({ authError: err.code ?? err.message ?? 'เข้าสู่ระบบไม่สำเร็จ' })
})

subscribeAuthState((user) => {
  useAuthStore.setState({ user, initialized: true })
  if (user && migratedForUid !== user.uid) {
    migratedForUid = user.uid
    migrateLocalDataIfNeeded(user.uid).catch((err) => console.error('migrateLocalDataIfNeeded failed', err))
  }
})
