import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Settings2, X } from 'lucide-react'
import { todayISO } from '../../lib/dateUtils'
import { generateDiagnosisId } from '../../lib/db/diagnoses'
import { resizeAndCompressImage } from '../../lib/images'
import { VISIT_TYPE_OPTIONS } from '../../lib/visitTypes'
import { useMedicationsStore } from '../../store/useMedicationsStore'
import MedicationChips from '../log/MedicationChips'

function emptyForm() {
  return {
    diagnosisId: null,
    date: todayISO(),
    diagnosisName: '',
    visitType: 'followup',
    medicationIds: [],
    nextAppointmentDate: '',
    note: '',
    photoBlob: null,
    photoBase64: null,
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
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadMedications()
  }, [loadMedications])

  useEffect(() => {
    if (diagnosis) {
      setForm({
        diagnosisId: diagnosis.diagnosisId,
        date: diagnosis.date ?? todayISO(),
        diagnosisName: diagnosis.diagnosisName ?? '',
        visitType: diagnosis.visitType ?? 'followup',
        medicationIds: diagnosis.medicationIds ?? [],
        nextAppointmentDate: diagnosis.nextAppointmentDate ?? '',
        note: diagnosis.note ?? '',
        photoBlob: null,
        photoBase64: diagnosis.photoBase64 ?? null,
      })
    } else {
      setForm(emptyForm())
    }
  }, [diagnosis])

  // Same reasoning as MedicationForm.jsx: a freshly-picked photo (Blob) previews via
  // createObjectURL; a photo already saved on the record arrives as a base64 data URI
  // and can be used as `src` directly.
  useEffect(() => {
    if (form.photoBlob) {
      const url = URL.createObjectURL(form.photoBlob)
      setPhotoPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPhotoPreviewUrl(form.photoBase64 ?? null)
  }, [form.photoBlob, form.photoBase64])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await resizeAndCompressImage(file)
    updateField('photoBlob', compressed)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.diagnosisName.trim()) return
    onSave({
      diagnosisId: form.diagnosisId ?? generateDiagnosisId(),
      date: form.date,
      diagnosisName: form.diagnosisName.trim(),
      visitType: form.visitType,
      medicationIds: form.medicationIds,
      nextAppointmentDate: form.nextAppointmentDate || null,
      note: form.note.trim() || null,
      photoBlob: form.photoBlob ?? undefined,
      photoBase64: form.photoBase64 ?? null,
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
        ประเภทการพบหมอ
        <select
          value={form.visitType}
          onChange={(e) => updateField('visitType', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        >
          {VISIT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
        นัดครั้งถัดไป (ถ้ามี)
        <input
          type="date"
          value={form.nextAppointmentDate}
          onChange={(e) => updateField('nextAppointmentDate', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        โน้ตเพิ่มเติม
        <textarea
          value={form.note}
          onChange={(e) => updateField('note', e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <div className="flex flex-col gap-2 text-sm text-text-secondary">
        แนบรูป/เอกสาร (ถ้ามี) — เช่น ใบสั่งยา, ผลตรวจ, ใบนัด
        {photoPreviewUrl ? (
          <div className="relative w-32">
            <img src={photoPreviewUrl} alt="" className="w-32 rounded-lg border border-border object-cover" />
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, photoBlob: null, photoBase64: null }))}
              aria-label="ลบรูป"
              className="absolute -right-2 -top-2 rounded-full bg-severity-3-bg p-1 text-severity-3-text"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-32 flex-col items-center gap-1 rounded-lg border border-dashed border-border p-4 text-text-muted"
          >
            <Camera size={20} />
            ถ่าย/เลือกรูป
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

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
