import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, LayoutList, Table2 } from 'lucide-react'
import { useEntriesStore } from '../store/useEntriesStore'
import { useMedicationsStore } from '../store/useMedicationsStore'
import PeriodSelector from '../components/report/PeriodSelector'
import StatsRow from '../components/dashboard/StatsRow'
import WeeklyTrend from '../components/report/WeeklyTrend'
import EntryList from '../components/report/EntryList'
import EntryDetailSheet from '../components/report/EntryDetailSheet'
import DiaryTable from '../components/report/DiaryTable'
import { todayISO, subtractDays } from '../lib/dateUtils'
import { PERIOD_PRESETS } from '../lib/reportPeriods'

function computeWeeklyBuckets(startDate, endDate, entries) {
  const buckets = []
  let cursor = startDate
  while (cursor <= endDate) {
    const bucketEnd = subtractDays(cursor, -6)
    const inBucket = entries.filter((e) => e.date >= cursor && e.date <= bucketEnd)
    buckets.push({ start: cursor, count: new Set(inBucket.map((e) => e.date)).size })
    cursor = subtractDays(cursor, -7)
  }
  return buckets
}

function ReportPage() {
  const navigate = useNavigate()
  const entries = useEntriesStore((state) => state.entries)
  const loadEntries = useEntriesStore((state) => state.load)
  const medications = useMedicationsStore((state) => state.medications)
  const loadMedications = useMedicationsStore((state) => state.load)

  const [viewMode, setViewMode] = useState('list') // 'list' | 'table'
  const [viewingEntry, setViewingEntry] = useState(null)
  const [periodKey, setPeriodKey] = useState('1m')
  const [customStart, setCustomStart] = useState(subtractDays(todayISO(), 29))
  const [customEnd, setCustomEnd] = useState(todayISO())
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  useEffect(() => {
    loadEntries()
    loadMedications()
  }, [loadEntries, loadMedications])

  const preset = PERIOD_PRESETS.find((p) => p.key === periodKey)
  const [startDate, endDate] =
    periodKey === 'custom' ? [customStart, customEnd] : [subtractDays(todayISO(), preset.days - 1), todayISO()]

  const periodEntries = entries.filter((e) => e.date >= startDate && e.date <= endDate)
  const headacheDays = new Set(periodEntries.map((e) => e.date)).size
  const medicationDays = new Set(periodEntries.filter((e) => e.medications?.length).map((e) => e.date)).size
  const buckets = computeWeeklyBuckets(startDate, endDate, periodEntries)
  const sortedEntries = [...periodEntries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      const [{ pdf }, { default: ExportDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/pdf/ExportDocument'),
      ])
      const blob = await pdf(
        <ExportDocument
          entries={periodEntries}
          medications={medications}
          startDate={startDate}
          endDate={endDate}
        />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `puadhead-${startDate}_${endDate}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setExportError('สร้าง PDF ไม่สำเร็จ ลองใหม่อีกครั้ง')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-text-primary">รายงาน</h1>
      </header>

      <div className="flex flex-col gap-4">
        <PeriodSelector value={periodKey} onChange={setPeriodKey} />

        {periodKey === 'custom' && (
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm text-text-secondary">
              จากวันที่
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-text-secondary">
              ถึงวันที่
              <input
                type="date"
                value={customEnd}
                min={customStart}
                max={todayISO()}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
              />
            </label>
          </div>
        )}

        <StatsRow headacheDays={headacheDays} medicationDays={medicationDays} />
        <WeeklyTrend buckets={buckets} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              viewMode === 'list' ? 'bg-primary text-white' : 'border border-border text-text-secondary'
            }`}
          >
            <LayoutList size={14} />
            รายการ
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              viewMode === 'table' ? 'bg-primary text-white' : 'border border-border text-text-secondary'
            }`}
          >
            <Table2 size={14} />
            ตาราง (ให้หมอดู)
          </button>
        </div>

        {viewMode === 'list' ? (
          <EntryList
            entries={sortedEntries}
            medications={medications}
            onView={(e) => setViewingEntry(e)}
            onEdit={(e) => navigate(`/log/${e.entryId}`)}
          />
        ) : (
          <DiaryTable entries={periodEntries} medications={medications} startDate={startDate} endDate={endDate} />
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-50"
        >
          <Download size={18} />
          {exporting ? 'กำลังสร้าง PDF...' : 'ส่งออก PDF'}
        </button>
        {exportError && <p className="text-sm text-severity-3-text">{exportError}</p>}
      </div>

      {viewingEntry && (
        <EntryDetailSheet entry={viewingEntry} medications={medications} onClose={() => setViewingEntry(null)} />
      )}
    </div>
  )
}

export default ReportPage
