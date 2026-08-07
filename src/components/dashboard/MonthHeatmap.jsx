import { todayISO } from '../../lib/dateUtils'

const WEEKDAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

// heatmap-2/3 are bolder than the severity-2/3-bg tokens used for text-bearing badges —
// on a small unlabeled cell, the pale badge tones read as barely-there.
function cellClass(severity) {
  if (severity === 3) return 'bg-heatmap-3'
  if (severity === 2) return 'bg-heatmap-2'
  if (severity === 1) return 'bg-border'
  return 'bg-surface border border-border'
}

// entries: entry[] already scoped to the displayed month. Multiple entries can share a
// date, so each day shows the MAX severity among its entries; tapping a day passes the
// date and that day's entries (possibly empty) back to the caller — an empty day starts
// a new retroactive entry, one entry opens it directly, more than one opens a chooser.
function MonthHeatmap({ entries, monthDate, onDayTap }) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const today = todayISO()

  const entriesByDay = new Map()
  for (const entry of entries) {
    const day = Number(entry.date.slice(8, 10))
    if (!entriesByDay.has(day)) entriesByDay.set(day, [])
    entriesByDay.get(day).push(entry)
  }

  const cells = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<div key={`lead-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayEntries = entriesByDay.get(day) ?? []
    const maxSeverity = dayEntries.length ? Math.max(...dayEntries.map((e) => e.severity)) : undefined
    const isFuture = date > today
    cells.push(
      <button
        key={day}
        type="button"
        disabled={isFuture}
        onClick={() => onDayTap(date, dayEntries)}
        className={`aspect-square rounded-[4px] flex items-center justify-center text-[10px] text-text-muted disabled:opacity-40 ${cellClass(maxSeverity)}`}
      >
        {day}
      </button>,
    )
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-[10px] text-text-muted">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  )
}

export default MonthHeatmap
