import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'
import SyncStatusBadge from './SyncStatusBadge'

// Wraps the 3 tab-bar pages (Dashboard / Report / Settings). Task-screens
// (quick-log, edit-entry, medication form) render outside this layout — no tab bar,
// back/X header instead (see TaskScreenHeader).
function MainLayout() {
  return (
    <>
      <div
        className="mx-auto flex w-full max-w-3xl justify-end px-4"
        style={{ paddingTop: 'calc(0.5rem + var(--safe-top))', marginBottom: '-1.5rem' }}
      >
        <SyncStatusBadge />
      </div>
      <div style={{ paddingBottom: 'calc(64px + var(--safe-bottom))' }}>
        <Outlet />
      </div>
      <TabBar />
    </>
  )
}

export default MainLayout
