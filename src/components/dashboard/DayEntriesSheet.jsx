import { X } from 'lucide-react'

const SEVERITY_DOT_CLASS = {
  1: 'bg-border',
  2: 'bg-severity-2-text',
  3: 'bg-severity-3-text',
}

// Shown when a heatmap day has more than one entry — lets the user pick which one to
// edit instead of guessing. (A day with exactly one entry skips this and opens it directly.)
function DayEntriesSheet({ entries, onSelect, onClose }) {
  const date = entries[0]?.date

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-t-2xl bg-surface-card p-4 pb-8"
        style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-text-primary">บันทึกวันที่ {date}</span>
          <button type="button" onClick={onClose} aria-label="ปิด" className="text-text-secondary">
            <X size={20} />
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li key={entry.entryId}>
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${SEVERITY_DOT_CLASS[entry.severity]}`} />
                <span className="flex-1 text-sm text-text-primary">
                  {entry.painStart ?? '—'} – {entry.painEnd ?? '—'}
                </span>
                <span className="text-xs text-text-muted">ระดับ {entry.severity}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DayEntriesSheet
