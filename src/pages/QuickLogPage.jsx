import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Droplets, Info, Pill, Settings2, Syringe } from 'lucide-react'
import { useMedicationsStore } from '../store/useMedicationsStore'
import { useEntriesStore } from '../store/useEntriesStore'
import { generateEntryId } from '../lib/db/entries'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'
import TimeRangePicker from '../components/log/TimeRangePicker'
import SeverityPicker from '../components/log/SeverityPicker'
import MedicationChips from '../components/log/MedicationChips'
import SymptomToggles from '../components/log/SymptomToggles'
import LocationPicker from '../components/log/LocationPicker'
import ToggleRow from '../components/log/ToggleRow'
import NoteField from '../components/log/NoteField'
import SaveButton from '../components/log/SaveButton'
import { todayISO, nowTimeHHMM } from '../lib/dateUtils'
import { EMPTY_SYMPTOMS } from '../lib/symptoms'

const EMPTY_EXTRA_FLAGS = { isMenstruating: false, cgrpInjectionDay: false }
const DATE_FORMATTER = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'long' })

// Single component, two modes — add (from Dashboard CTA / cover-mode) and edit (tapping
// a heatmap day or a Report entry row). See docs/design-reference.md's quick-log/edit-entry screen.
function QuickLogPage({ mode }) {
  const navigate = useNavigate()
  const { entryId } = useParams()
  const routerLocation = useLocation()
  const medications = useMedicationsStore((state) => state.medications)
  const loadMedications = useMedicationsStore((state) => state.load)
  const entries = useEntriesStore((state) => state.entries)
  const entriesLoaded = useEntriesStore((state) => state.loaded)
  const loadEntries = useEntriesStore((state) => state.load)
  const saveEntry = useEntriesStore((state) => state.save)
  const removeEntry = useEntriesStore((state) => state.remove)

  // Tapping an empty past day on the Dashboard heatmap passes a date to pre-fill (a
  // retroactive entry) — falls back to today when opened from the main CTA/cover-mode.
  const [date, setDate] = useState(routerLocation.state?.date ?? todayISO())
  const [severity, setSeverity] = useState(null)
  const [painStart, setPainStart] = useState(mode === 'add' ? nowTimeHHMM() : null)
  const [painEnd, setPainEnd] = useState(mode === 'add' ? nowTimeHHMM() : null)
  const [symptoms, setSymptoms] = useState(EMPTY_SYMPTOMS)
  const [painLocation, setPainLocation] = useState([])
  const [extraFlags, setExtraFlags] = useState(EMPTY_EXTRA_FLAGS)
  const [notes, setNotes] = useState(null)
  const [medicationIds, setMedicationIds] = useState([])
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(mode === 'add')

  useEffect(() => {
    loadMedications()
    loadEntries()
  }, [loadMedications, loadEntries])

  // Reads from the already-loaded entries store instead of fetching by ID directly —
  // the store is hybrid (Firestore when signed in, IndexedDB as a guest, see
  // useEntriesStore.js), so a direct IndexedDB lookup here would silently find nothing
  // for a Firestore-backed entry and leave the page blank forever.
  useEffect(() => {
    if (mode !== 'edit' || !entriesLoaded) return
    const entry = entries.find((e) => e.entryId === entryId)
    if (!entry) return
    setDate(entry.date)
    setSeverity(entry.severity)
    setPainStart(entry.painStart)
    setPainEnd(entry.painEnd)
    setSymptoms(entry.symptoms ?? EMPTY_SYMPTOMS)
    setPainLocation(entry.location ?? [])
    setExtraFlags({
      isMenstruating: entry.isMenstruating ?? false,
      cgrpInjectionDay: entry.cgrpInjectionDay ?? false,
    })
    setNotes(entry.notes ?? null)
    setMedicationIds((entry.medications ?? []).map((m) => m.medicationId))
    setReady(true)
  }, [mode, entryId, entries, entriesLoaded])

  async function handleSave() {
    if (severity == null) return
    setSaving(true)
    const entry = {
      entryId: mode === 'edit' ? entryId : generateEntryId(date),
      date,
      headacheType: 'migraine',
      painStart,
      painEnd,
      severity,
      symptoms,
      location: painLocation,
      medications: medicationIds.map((id) => ({ medicationId: id, time: null, escalated: false })),
      isMenstruating: extraFlags.isMenstruating,
      cgrpInjectionDay: extraFlags.cgrpInjectionDay,
      extendedTriggers: {
        sleepHours: null,
        stressLevel: null,
        weather: null,
        foodTags: [],
        screenTimeHours: null,
      },
      notes: notes?.trim() || null,
    }
    await saveEntry(entry)
    setSaving(false)
    navigate(-1)
  }

  async function handleDelete() {
    if (!window.confirm('ลบบันทึกนี้ใช่ไหม? กู้คืนไม่ได้')) return
    await removeEntry(entryId)
    navigate('/')
  }

  if (mode === 'edit' && !ready) return null

  const headerTitle =
    date === todayISO() ? 'บันทึกวันนี้' : DATE_FORMATTER.format(new Date(`${date}T00:00:00`))

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <div className="full-log-sections flex flex-col gap-6">
        <TaskScreenHeader
          title={headerTitle}
          onBack={() => navigate(-1)}
          icon={mode === 'add' ? 'close' : 'back'}
        />
        {mode === 'edit' && (
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            วันที่
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
            />
          </label>
        )}
        <TimeRangePicker
          painStart={painStart}
          painEnd={painEnd}
          onChangeStart={setPainStart}
          onChangeEnd={setPainEnd}
        />
        <SeverityPicker value={severity} onChange={setSeverity} />
        <SymptomToggles value={symptoms} onChange={setSymptoms} />
        <LocationPicker value={painLocation} onChange={setPainLocation} />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
              <Pill size={16} />
              ยาที่ใช้
            </div>
            <button
              type="button"
              onClick={() => navigate('/medications')}
              className="flex items-center gap-1 text-xs text-text-secondary underline"
            >
              <Settings2 size={12} />
              จัดการยา
            </button>
          </div>
          <MedicationChips medications={medications} value={medicationIds} onChange={setMedicationIds} />
          <ToggleRow
            icon={Syringe}
            label="วันฉีดยา CGRP"
            active={extraFlags.cgrpInjectionDay}
            onToggle={() =>
              setExtraFlags((prev) => ({ ...prev, cgrpInjectionDay: !prev.cgrpInjectionDay }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <Info size={16} />
            บริบทเพิ่มเติม
          </div>
          <ToggleRow
            icon={Droplets}
            label="มีประจำเดือน"
            active={extraFlags.isMenstruating}
            onToggle={() =>
              setExtraFlags((prev) => ({ ...prev, isMenstruating: !prev.isMenstruating }))
            }
          />
        </div>
        <NoteField value={notes} onChange={setNotes} />
        <SaveButton onClick={handleSave} disabled={severity == null || saving} />
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete} className="text-center text-sm text-severity-3-text">
            ลบบันทึกนี้
          </button>
        )}
      </div>

      <div className="cover-mode flex flex-col gap-3 py-4">
        <p className="text-center text-sm text-text-secondary">ปวดแค่ไหน</p>
        <SeverityPicker value={severity} onChange={setSeverity} compact />
        <SaveButton onClick={handleSave} disabled={severity == null || saving} />
      </div>
    </div>
  )
}

export default QuickLogPage
