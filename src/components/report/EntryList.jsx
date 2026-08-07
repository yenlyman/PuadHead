import { NotebookPen, Pencil, Syringe } from 'lucide-react'
import { ALL_SYMPTOMS } from '../../lib/symptoms'
import { LOCATION_LABEL_BY_KEY } from '../../lib/locations'

const SEVERITY_CLASS = {
  1: 'bg-border text-text-primary',
  2: 'bg-severity-2-bg text-severity-2-text',
  3: 'bg-severity-3-bg text-severity-3-text',
}

function SymptomIcons({ entry }) {
  const active = ALL_SYMPTOMS.filter(({ key }) => entry.symptoms?.[key])
  if (active.length === 0 && !entry.cgrpInjectionDay) return null
  return (
    <div className="flex items-center gap-1 text-text-muted">
      {active.map(({ key, Icon }) => (
        <Icon key={key} size={12} />
      ))}
      {entry.cgrpInjectionDay && <Syringe size={12} />}
    </div>
  )
}

// entries: sorted newest-first by the caller. Tapping the row body opens a read-only
// detail popup (onView) — editing is a deliberate, separate action only reachable via
// the small pencil icon (onEdit), not the whole row, since edits are rare but viewing
// isn't. (See EntryDetailSheet.jsx for why the popup itself has no edit button.)
function EntryList({ entries, medications, onView, onEdit }) {
  const medById = new Map(medications.map((m) => [m.id, m]))

  if (entries.length === 0) {
    return <p className="text-sm text-text-muted">ไม่มีบันทึกในช่วงนี้</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => {
        const medNames = (entry.medications || [])
          .map((m) => medById.get(m.medicationId)?.name)
          .filter(Boolean)
          .join(', ')
        const locationLabels = (entry.location || []).map((key) => LOCATION_LABEL_BY_KEY[key]).join(', ')
        return (
          <li key={entry.entryId}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onView(entry)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onView(entry)}
              className="relative flex w-full items-center gap-3 rounded-xl border border-border bg-surface-card p-3 text-left"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${SEVERITY_CLASS[entry.severity]}`}
              >
                {entry.severity}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text-primary">
                  {entry.date} · {entry.painStart ?? '—'}–{entry.painEnd ?? '—'}
                </div>
                <div className="truncate text-xs text-text-secondary">
                  {medNames || 'ไม่ได้ทานยา'}
                  {locationLabels && ` · ${locationLabels}`}
                </div>
                <div className="flex items-center gap-2">
                  <SymptomIcons entry={entry} />
                  {entry.notes && <NotebookPen size={12} className="text-text-muted" />}
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(entry)
                }}
                aria-label="แก้ไขบันทึกนี้"
                className="absolute right-2 top-2 shrink-0 p-1.5 text-text-muted"
              >
                <Pencil size={13} />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default EntryList
