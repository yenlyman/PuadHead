import { subtractDays } from '../dateUtils'

// Verbatim from docs/puadhead-spec-handoff.md section 3 (ICHD-3-based thresholds).
const THRESHOLD = {
  simple_analgesic: 15,
  NSAID: 15,
  triptan: 10,
  ergot: 10,
  opioid: 10,
  gepant: 10,
}

// Counts DAYS a moClass was used, not doses — two episodes on the same day using the
// same class (e.g. paracetamol at both a morning and evening headache) count once, per
// ICHD-3. A Set per moClass dedupes by date.
export function checkOveruseRisk(entries, medications, asOfDate) {
  const windowStart = subtractDays(asOfDate, 29) // rolling 30 วัน
  const daysByClass = {}

  entries
    .filter((e) => e.date >= windowStart && e.date <= asOfDate)
    .forEach((e) => {
      ;(e.medications || []).forEach((m) => {
        const med = medications.find((md) => md.id === m.medicationId)
        if (!med?.moClass) return
        daysByClass[med.moClass] = daysByClass[med.moClass] || new Set()
        daysByClass[med.moClass].add(e.date)
      })
    })

  return Object.entries(daysByClass).map(([moClass, dateSet]) => {
    const days = dateSet.size
    const limit = THRESHOLD[moClass]
    const ratio = days / limit
    const level = ratio >= 1 ? 'critical' : ratio >= 0.7 ? 'warning' : 'safe'
    return { moClass, days, limit, level }
  })
}
