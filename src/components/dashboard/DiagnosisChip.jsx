import { useNavigate } from 'react-router-dom'
import { ChevronRight, Stethoscope } from 'lucide-react'
import { todayISO } from '../../lib/dateUtils'

// The only entry point into /diagnoses (mirrors SyncStatusBadge being the only path into
// /login) — shown at the top of Dashboard, not tucked in Settings, because this is
// information worth seeing every time the app opens, not just something to configure once.
function DiagnosisChip({ diagnoses }) {
  const navigate = useNavigate()
  const latest = [...diagnoses].sort((a, b) => (a.date < b.date ? 1 : -1))[0]
  // Only surface a future appointment — a past one is stale info and would just sit
  // here forever otherwise (this is a plain date comparison, not medical interpretation).
  const upcomingAppointment =
    latest?.nextAppointmentDate && latest.nextAppointmentDate >= todayISO() ? latest.nextAppointmentDate : null

  if (!latest) {
    return (
      <button
        type="button"
        onClick={() => navigate('/diagnoses/new')}
        className="mb-4 flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 text-xs text-text-secondary shadow-sm"
      >
        <Stethoscope size={12} />
        + บันทึกผลวินิจฉัย
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/diagnoses')}
      className="mb-4 flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface-card px-3 py-1 text-xs text-primary shadow-sm"
    >
      <Stethoscope size={12} className="shrink-0" />
      <span className="min-w-0 break-words">
        {latest.diagnosisName}
        {upcomingAppointment && ` · นัดครั้งถัดไป ${upcomingAppointment}`}
      </span>
      <ChevronRight size={12} className="shrink-0" />
    </button>
  )
}

export default DiagnosisChip
