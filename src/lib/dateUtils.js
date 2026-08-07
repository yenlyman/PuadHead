// Uses local date components, not toISOString() (which converts to UTC) — Thailand is
// UTC+7, so between midnight and 7am local time toISOString() would report YESTERDAY's
// date, which is exactly when someone logging an overnight headache is likely to open
// the app.
export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function nowTimeHHMM() {
  const date = new Date()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function subtractDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`)
  d.setDate(d.getDate() - days)
  return toISODate(d)
}

// Returns [startISO, endISO] inclusive for the calendar month containing isoDate.
export function monthRange(isoDate) {
  const [year, month] = isoDate.split('-').map(Number)
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return [start, end]
}
