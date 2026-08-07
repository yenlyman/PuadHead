import { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { resizeAndCompressImage } from '../../lib/images'

const TYPE_OPTIONS = [
  { value: 'acute', label: 'ยาแก้ปวดเฉียบพลัน (acute)' },
  { value: 'preventive', label: 'ยาป้องกัน (preventive)' },
  { value: 'hybrid', label: 'ทั้งสองแบบ (hybrid)' },
]

const MOCLASS_OPTIONS = [
  { value: '', label: 'ไม่มี / ไม่เกี่ยวข้อง' },
  { value: 'simple_analgesic', label: 'simple_analgesic — พาราเซตามอล' },
  { value: 'NSAID', label: 'NSAID — ไอบูโพรเฟน, ไดโคลฟีแนค' },
  { value: 'triptan', label: 'triptan' },
  { value: 'ergot', label: 'ergot' },
  { value: 'opioid', label: 'opioid' },
  { value: 'gepant', label: 'gepant' },
]

function emptyForm() {
  return {
    id: null,
    name: '',
    type: 'acute',
    moClass: '',
    scheduledFrequency: '',
    maxDosePerDay: '',
    escalationRule: '',
    notes: '',
    photoBlob: null,
    photoBase64: null,
  }
}

// medication: existing record to edit, or null to add a new one.
function MedicationForm({ medication, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (medication) {
      setForm({
        id: medication.id,
        name: medication.name ?? '',
        type: medication.type ?? 'acute',
        moClass: medication.moClass ?? '',
        scheduledFrequency: medication.scheduledFrequency ?? '',
        maxDosePerDay: medication.maxDosePerDay ?? '',
        escalationRule: medication.escalationRule ?? '',
        notes: medication.notes ?? '',
        photoBlob: null,
        photoBase64: medication.photoBase64 ?? null,
      })
    } else {
      setForm(emptyForm())
    }
  }, [medication])

  // A freshly-picked photo (Blob, not yet saved) previews via createObjectURL; a photo
  // already saved on the record arrives as a base64 data URI and can be used as `src`
  // directly — no blob/object-URL machinery needed for that path.
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
    if (!form.name.trim()) return
    onSave({
      id: form.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      type: form.type,
      moClass: form.moClass || null,
      scheduledFrequency: form.scheduledFrequency.trim() || null,
      maxDosePerDay: form.maxDosePerDay === '' ? null : Number(form.maxDosePerDay),
      escalationRule: form.escalationRule.trim() || undefined,
      notes: form.notes.trim() || undefined,
      photoBlob: form.photoBlob ?? undefined,
      photoBase64: form.photoBase64 ?? null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        ชื่อยา
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        ประเภท
        <select
          value={form.type}
          onChange={(e) => updateField('type', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        กลุ่มยา (moClass) — ใช้คำนวณ overuse alert
        <select
          value={form.moClass}
          onChange={(e) => updateField('moClass', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        >
          {MOCLASS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        ความถี่ตามตาราง (ถ้ามี)
        <input
          type="text"
          value={form.scheduledFrequency}
          onChange={(e) => updateField('scheduledFrequency', e.target.value)}
          placeholder="เช่น daily_before_bed"
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        ขนาดยาสูงสุดต่อวัน (ถ้ามี)
        <input
          type="number"
          min="0"
          value={form.maxDosePerDay}
          onChange={(e) => updateField('maxDosePerDay', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        เงื่อนไขการเพิ่มยา (ถ้ามี)
        <input
          type="text"
          value={form.escalationRule}
          onChange={(e) => updateField('escalationRule', e.target.value)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text-secondary">
        หมายเหตุ
        <textarea
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={2}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>

      <div className="flex flex-col gap-2 text-sm text-text-secondary">
        รูปซองยา (ถ้ามี)
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

export default MedicationForm
