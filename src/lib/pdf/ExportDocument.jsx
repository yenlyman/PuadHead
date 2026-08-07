import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import {
  SunIcon,
  SpeakerIcon,
  DropletIcon,
  SparklesIcon,
  SyringeIcon,
  WindIcon,
  RotateCwIcon,
  EyeOffIcon,
  HandIcon,
  EarIcon,
  CompassIcon,
  FrownIcon,
  ThermometerIcon,
  ActivityIcon,
  BoneIcon,
  MoonIcon,
} from './pdfIcons'
import { LOCATION_LABEL_BY_KEY } from '../locations'

// Helvetica (the PDF base-14 font) has no Thai glyphs — Thai text silently renders as
// garbage without an embedded font that covers the Thai script. Sarabun is a Thai-subset
// OFL font (see public/fonts/SARABUN-LICENSE.txt), extracted from @fontsource/sarabun.
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.woff', fontWeight: 'normal' },
    { src: '/fonts/Sarabun-Bold.woff', fontWeight: 'bold' },
  ],
})

const SYMPTOM_ICONS = [
  { key: 'photophobia', Icon: SunIcon },
  { key: 'phonophobia', Icon: SpeakerIcon },
  { key: 'nausea', Icon: DropletIcon },
  { key: 'aura', Icon: SparklesIcon },
  { key: 'osmophobia', Icon: WindIcon },
  { key: 'vertigo', Icon: RotateCwIcon },
  { key: 'blurredVision', Icon: EyeOffIcon },
  { key: 'numbness', Icon: HandIcon },
  { key: 'tinnitus', Icon: EarIcon },
  { key: 'imbalance', Icon: CompassIcon },
  { key: 'confusion', Icon: FrownIcon },
  { key: 'fever', Icon: ThermometerIcon },
  { key: 'fatigue', Icon: ActivityIcon },
  { key: 'neckStiffness', Icon: BoneIcon },
  { key: 'sleepDisturbance', Icon: MoonIcon },
]

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: 'Sarabun', color: '#1A1A18' },
  title: { fontSize: 16, marginBottom: 2, fontWeight: 'bold' },
  subtitle: { fontSize: 9, color: '#6B6A63', marginBottom: 16 },
  monthHeading: { fontSize: 11, marginTop: 14, marginBottom: 6, fontWeight: 'bold' },
  table: { borderWidth: 1, borderColor: '#E5E3DC' },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F7F4',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E3DC',
  },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E3DC' },
  headerCell: { padding: 4, fontSize: 8, color: '#6B6A63' },
  cellDay: { width: '10%', padding: 4, borderRightWidth: 1, borderRightColor: '#E5E3DC' },
  cellSeverity: {
    width: '15%',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#E5E3DC',
    alignItems: 'center',
  },
  cellMedication: { width: '35%', padding: 4, borderRightWidth: 1, borderRightColor: '#E5E3DC' },
  cellSymptoms: { width: '40%', padding: 4 },
  symptomIconRow: { flexDirection: 'row', alignItems: 'center' },
  severityBadge: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  symptomIconWrap: { marginRight: 6 },
  locationText: { fontSize: 7, color: '#6B6A63', marginTop: 2 },
  dash: { color: '#9B9A91' },
})

const SEVERITY_COLORS = {
  1: { bg: '#F8F7F4', text: '#1A1A18' },
  2: { bg: '#FEF3C7', text: '#92400E' },
  3: { bg: '#FEE2E2', text: '#991B1B' },
}

const MONTH_NAMES_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

// Buddhist Era year, matching the th-TH locale convention used elsewhere in the app.
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

function SeverityCell({ entry }) {
  if (!entry) return <Text style={styles.dash}>-</Text>
  const color = SEVERITY_COLORS[entry.severity]
  return (
    <View style={[styles.severityBadge, { backgroundColor: color.bg }]}>
      <Text style={{ color: color.text, fontSize: 8 }}>{entry.severity}</Text>
    </View>
  )
}

function SymptomsCell({ entry }) {
  const active = entry ? SYMPTOM_ICONS.filter(({ key }) => entry.symptoms?.[key]) : []
  const icons = [...active.map(({ key, Icon }) => ({ key, Icon }))]
  if (entry?.cgrpInjectionDay) icons.push({ key: 'cgrp', Icon: SyringeIcon })
  const locationLabels = (entry?.location ?? []).map((key) => LOCATION_LABEL_BY_KEY[key]).join(', ')

  if (icons.length === 0 && !locationLabels) return <Text style={styles.dash}>-</Text>

  return (
    <View>
      <View style={styles.symptomIconRow}>
        {icons.map(({ key, Icon }) => (
          <View key={key} style={styles.symptomIconWrap}>
            <Icon size={10} />
          </View>
        ))}
      </View>
      {locationLabels && <Text style={styles.locationText}>{locationLabels}</Text>}
    </View>
  )
}

// entries/medications are pre-filtered to the selected date range by the caller. A day
// can have more than one entry (multiple episodes) — each renders as its own row,
// repeating the day number, rather than needing a rowspan the PDF table layout can't do.
function ExportDocument({ entries, medications, startDate, endDate }) {
  const entriesByDate = new Map()
  for (const entry of entries) {
    if (!entriesByDate.has(entry.date)) entriesByDate.set(entry.date, [])
    entriesByDate.get(entry.date).push(entry)
  }
  const medById = new Map(medications.map((m) => [m.id, m]))
  const months = monthsBetween(startDate, endDate)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>บันทึกอาการปวดหัว — ปวดเฮด</Text>
        <Text style={styles.subtitle}>
          ช่วงวันที่ {startDate} ถึง {endDate}
        </Text>

        {months.map(({ year, month }) => {
          const daysInMonth = new Date(year, month, 0).getDate()
          const rows = []
          for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            if (date < startDate || date > endDate) continue
            const dayEntries = entriesByDate.get(date) ?? [null]
            for (const entry of dayEntries) {
              rows.push({ day, entry })
            }
          }
          if (rows.length === 0) return null

          return (
            <View key={`${year}-${month}`} wrap={false}>
              <Text style={styles.monthHeading}>
                {MONTH_NAMES_TH[month - 1]} {toBuddhistYear(year)}
              </Text>
              <View style={styles.table}>
                <View style={styles.headerRow}>
                  <Text style={[styles.headerCell, styles.cellDay]}>วันที่</Text>
                  <Text style={[styles.headerCell, styles.cellSeverity]}>ระดับ</Text>
                  <Text style={[styles.headerCell, styles.cellMedication]}>ยา</Text>
                  <Text style={[styles.headerCell, styles.cellSymptoms]}>อาการ</Text>
                </View>
                {rows.map(({ day, entry }, i) => {
                  const medNames = (entry?.medications ?? [])
                    .map((m) => medById.get(m.medicationId)?.name)
                    .filter(Boolean)
                    .join(', ')
                  return (
                    <View key={`${day}-${i}`} style={styles.row}>
                      <View style={styles.cellDay}>
                        <Text>{day}</Text>
                      </View>
                      <View style={styles.cellSeverity}>
                        <SeverityCell entry={entry} />
                      </View>
                      <View style={styles.cellMedication}>
                        <Text>{medNames || '-'}</Text>
                      </View>
                      <View style={styles.cellSymptoms}>
                        <SymptomsCell entry={entry} />
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </Page>
    </Document>
  )
}

export default ExportDocument
