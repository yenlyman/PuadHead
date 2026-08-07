import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useEntriesStore } from '../store/useEntriesStore'
import { useMedicationsStore } from '../store/useMedicationsStore'
import { useDiagnosesStore } from '../store/useDiagnosesStore'
import StatsRow from '../components/dashboard/StatsRow'
import OveruseAlertBanner from '../components/dashboard/OveruseAlertBanner'
import MonthHeatmap from '../components/dashboard/MonthHeatmap'
import Legend from '../components/dashboard/Legend'
import EmptyState from '../components/common/EmptyState'
import DayEntriesSheet from '../components/dashboard/DayEntriesSheet'
import DiagnosisChip from '../components/dashboard/DiagnosisChip'
import EntryDetailSheet from '../components/report/EntryDetailSheet'
import { monthRange, todayISO } from '../lib/dateUtils'
import { checkOveruseRisk } from '../lib/overuse/checkOveruseRisk'

const MONTH_FORMATTER = new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' })

function DashboardPage() {
  const navigate = useNavigate()
  const entries = useEntriesStore((state) => state.entries)
  const loaded = useEntriesStore((state) => state.loaded)
  const load = useEntriesStore((state) => state.load)
  const medications = useMedicationsStore((state) => state.medications)
  const loadMedications = useMedicationsStore((state) => state.load)
  const diagnoses = useDiagnosesStore((state) => state.diagnoses)
  const loadDiagnoses = useDiagnosesStore((state) => state.load)
  const [dayEntries, setDayEntries] = useState(null)
  const [viewingEntry, setViewingEntry] = useState(null)

  useEffect(() => {
    load()
    loadMedications()
    loadDiagnoses()
  }, [load, loadMedications, loadDiagnoses])

  const now = new Date()
  const [monthStart, monthEnd] = monthRange(now.toISOString().slice(0, 10))
  const monthEntries = entries.filter((e) => e.date >= monthStart && e.date <= monthEnd)
  const headacheDays = new Set(monthEntries.map((e) => e.date)).size
  const medicationDays = new Set(monthEntries.filter((e) => e.medications?.length).map((e) => e.date)).size
  const risks = checkOveruseRisk(entries, medications, todayISO()).filter((r) => r.level !== 'safe')

  function handleDayTap(date, entriesForDay) {
    if (entriesForDay.length === 0) {
      navigate('/log/new', { state: { date } })
    } else if (entriesForDay.length === 1) {
      setViewingEntry(entriesForDay[0])
    } else {
      setDayEntries(entriesForDay)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-xl font-semibold text-text-primary">บันทึกอาการปวดหัว</h1>
        <span className="text-sm text-text-secondary">{MONTH_FORMATTER.format(now)}</span>
      </header>

      <DiagnosisChip diagnoses={diagnoses} />

      {!loaded ? null : entries.length === 0 ? (
        <EmptyState message="ยังไม่มีบันทึก เริ่มบันทึกอาการปวดหัววันนี้ได้เลย" />
      ) : (
        <div className="layout">
          <div className="flex flex-col gap-4">
            <StatsRow headacheDays={headacheDays} medicationDays={medicationDays} />
            <OveruseAlertBanner risks={risks} />
          </div>
          <div className="flex flex-col gap-3">
            <MonthHeatmap entries={monthEntries} monthDate={now} onDayTap={handleDayTap} />
            <Legend />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate('/log/new')}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white"
      >
        <Plus size={20} />
        บันทึกวันนี้
      </button>

      {dayEntries && (
        <DayEntriesSheet
          entries={dayEntries}
          onSelect={(entry) => {
            setDayEntries(null)
            setViewingEntry(entry)
          }}
          onClose={() => setDayEntries(null)}
        />
      )}

      {viewingEntry && (
        <EntryDetailSheet
          entry={viewingEntry}
          medications={medications}
          onEdit={() => navigate(`/log/${viewingEntry.entryId}`)}
          onClose={() => setViewingEntry(null)}
        />
      )}
    </div>
  )
}

export default DashboardPage
