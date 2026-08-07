import { Syringe } from 'lucide-react'
import { ALL_SYMPTOMS } from '../../lib/symptoms'
import { LOCATION_LABEL_BY_KEY } from '../../lib/locations'

// Mirrors ExportDocument.jsx's PDF table (same columns, same day-row-per-entry logic)
// but rendered as HTML/Tailwind instead of react-pdf — for showing a doctor live on
// screen without exporting a file first. Icon set imported from the shared
// src/lib/symptoms.js config (PDF uses separate SVG-path versions in pdfIcons.jsx) since
// the two rendering contexts can't share component implementations.

const SEVERITY_CLASS = {
  1: 'bg-border text-text-primary',
  2: 'bg-severity-2-bg text-severity-2-text',
  3: 'bg-severity-3-bg text-severity-3-text',
}

const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

function toBuddhistYear(year) {
  return year + 543
}

function monthsBetween(startISO, endISO) {
  const [startYear, startMonth] = startISO.split('-').map(Number)
  const [endYear, endMonth] = endISO.split('-').map(Number)
  const months = []
  let year = startYear
  let month = startMonth
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push({ year, month })
    month += 1
    if (month > 12) {
      month = 1
      year += 1
    }
  }
  return months
}

function SymptomIcons({ entry }) {
  const active = entry ? ALL_SYMPTOMS.filter(({ key }) => entry.symptoms?.[key]) : []
  const locationLabels = (entry?.location || []).map((key) => LOCATION_LABEL_BY_KEY[key]).join(', ')
  if (active.length === 0 && !entry?.cgrpInjectionDay && !locationLabels) {
    return <span className="text-text-muted">-</span>
  }
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-text-secondary">
        {active.map(({ key, Icon }) => (
          <Icon key={key} size={14} />
        ))}
        {entry?.cgrpInjectionDay && <Syringe size={14} />}
      </div>
      {locationLabels && <div className="text-xs text-text-muted">{locationLabels}</div>}
    </div>
  )
}

// entries/medications pre-filtered to the selected period by the caller (ReportPage).
function DiaryTable({ entries, medications, startDate, endDate }) {
  const entriesByDate = new Map()
  for (const entry of entries) {
    if (!entriesByDate.has(entry.date)) entriesByDate.set(entry.date, [])
    entriesByDate.get(entry.date).push(entry)
  }
  const medById = new Map(medications.map((m) => [m.id, m]))
  const months = monthsBetween(startDate, endDate)

  return (
    <div className="flex flex-col gap-6">
      {months.map(({ year, month }) => {
        const daysInMonth = new Date(year, month, 0).getDate()
        const rows = []
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          if (date < startDate || date > endDate) continue
          const dayEntries = entriesByDate.get(date) ?? [null]
          for (const entry of dayEntries) rows.push({ day, entry })
        }
        if (rows.length === 0) return null

        return (
          <div key={`${year}-${month}`}>
            <h3 className="mb-2 text-sm font-medium text-text-secondary">
              {MONTH_NAMES_TH[month - 1]} {toBuddhistYear(year)}
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[420px] table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-12" />
                  <col className="w-12" />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr className="border-b border-border bg-surface text-xs text-text-secondary">
                    <th className="p-2 text-left font-medium">วันที่</th>
                    <th className="p-2 text-left font-medium">ระดับ</th>
                    <th className="p-2 text-left font-medium">ยา</th>
                    <th className="p-2 text-left font-medium">อาการ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ day, entry }, i) => {
                    const medNames = (entry?.medications ?? [])
                      .map((m) => medById.get(m.medicationId)?.name)
                      .filter(Boolean)
                      .join(', ')
                    return (
                      <tr key={`${day}-${i}`} className="border-b border-border last:border-b-0">
                        <td className="p-2 text-text-primary">{day}</td>
                        <td className="p-2">
                          {entry ? (
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${SEVERITY_CLASS[entry.severity]}`}
                            >
                              {entry.severity}
                            </span>
                          ) : (
                            <span className="text-text-muted">-</span>
                          )}
                        </td>
                        <td className="p-2 text-text-secondary">{medNames || '-'}</td>
                        <td className="p-2">
                          <SymptomIcons entry={entry} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DiaryTable
