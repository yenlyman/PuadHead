import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import { todayISO } from '../../lib/dateUtils'
import { generateDiagnosisId } from '../../lib/db/diagnoses'
import { useMedicationsStore } from '../../store/useMedicationsStore'
import MedicationChips from '../log/MedicationChips'

function emptyForm() {
  return {
    diagnosisId: null,
    date: todayISO(),
    diagnosisName: '',
    medicationIds: [],
    note: '',
  }
}

// diagnosis: existing record to edit, or null to add a new one. "ยาที่หมอสั่ง" reuses the
// same medications catalog as quick-log's MedicationChips (not a freeform text field) —
// otherwise a prescribed medication would need typing twice: once here, once in "จัดการยา"
// before it could be selected during an actual pain-episode log.
function DiagnosisForm({ diagnosis, onSave, onCancel }) {
  const navigate = useNavigate()
  const medications = useMedicationsStore((state) => state.medications)
  const loadMedications = useMedicationsStore((state) => state.load)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    loadMedications()
  }, [loadMedications])

  useEffect(() => {
    if (diagnosis) {
      setForm({
        diagnosisId: diagnosis.diagnosisId,
        date: diagnosis.date ?? todayISO(),
        diagnosisName: diagnosis.diagnosisName ?? '',
        medicationIds: diagnosis.medicationIds ?? [],
        note: diagnosis.note ?? '',
      })
    } else {
      setForm(emptyForm())
    }
  }, [diagnosis])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.diagnosisName.trim()) return
    onSave({
      diagnosisId: form.diagnosisId ?? generateDiagnosisId(),
      date: form.date,
      diagnosisName: form.diagnosisName.trim(),
      medicationIds: form.medicationIds,
      note: form.note.trim() || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        วันที่วินิจฉัย
        <input
          type="date"
          required
          value={form.date}
          max={todayISO()}
          onChange={(e) => updateField('date', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        หมอบอกว่าเป็นอะไร
        <input
          type="text"
          required
          value={form.diagnosisName}
          onChange={(e) => updateField('diagnosisName', e.target.value)}
          placeholder="เช่น Migraine"
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">ยาที่หมอสั่ง (ถ้ามี)</span>
          <button
            type="button"
            onClick={() => navigate('/medications')}
            className="flex items-center gap-1 text-xs text-text-secondary underline"
          >
            <Settings2 size={12} />
            จัดการยา
          </button>
        </div>
        <MedicationChips
          medications={medications}
          value={form.medicationIds}
          onChange={(medicationIds) => updateField('medicationIds', medicationIds)}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        โน้ตเพิ่มเติม
        <textarea
          value={form.note}
          onChange={(e) => updateField('note', e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 rounded-xl bg-primary py-3 font-medium text-white">
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-border py-3 font-medium text-text-primary"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  )
}

export default DiagnosisForm
