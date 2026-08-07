import { CalendarClock, Pencil, Stethoscope, Trash2 } from 'lucide-react'
import { VISIT_TYPE_LABEL } from '../../lib/visitTypes'

function Thumbnail({ photoBase64 }) {
  if (!photoBase64) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-text-muted">
        <Stethoscope size={18} />
      </div>
    )
  }
  return <img src={photoBase64} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" />
}

function DiagnosisList({ diagnoses, medications, onEdit, onDelete }) {
  if (diagnoses.length === 0) {
    return <p className="text-sm text-text-muted">ยังไม่มีผลวินิจฉัยที่บันทึกไว้</p>
  }

  const medById = new Map(medications.map((m) => [m.id, m]))
  const sorted = [...diagnoses].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((diagnosis) => {
        const medNames = (diagnosis.medicationIds ?? [])
          .map((id) => medById.get(id)?.name)
          .filter(Boolean)
          .join(', ')
        const visitTypeLabel = VISIT_TYPE_LABEL[diagnosis.visitType]
        return (
          <li
            key={diagnosis.diagnosisId}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3"
          >
            <Thumbnail photoBase64={diagnosis.photoBase64} />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-text-primary">{diagnosis.diagnosisName}</div>
              <div className="text-xs text-text-secondary">
                {diagnosis.date}
                {visitTypeLabel ? ` · ${visitTypeLabel}` : ''}
              </div>
              {medNames && <div className="truncate text-xs text-text-secondary">{medNames}</div>}
              {diagnosis.nextAppointmentDate && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <CalendarClock size={12} />
                  นัดครั้งถัดไป {diagnosis.nextAppointmentDate}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEdit(diagnosis.diagnosisId)}
              aria-label="แก้ไข"
              className="text-text-secondary"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(diagnosis.diagnosisId)}
              aria-label="ลบ"
              className="text-severity-3-text"
            >
              <Trash2 size={18} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default DiagnosisList
