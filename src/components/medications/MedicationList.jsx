import { Pencil, Trash2, Pill } from 'lucide-react'

function Thumbnail({ photoBase64 }) {
  if (!photoBase64) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface text-text-muted">
        <Pill size={18} />
      </div>
    )
  }
  return <img src={photoBase64} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover" />
}

function MedicationList({ medications, onEdit, onDelete }) {
  if (medications.length === 0) {
    return <p className="text-sm text-text-muted">ยังไม่มียาในระบบ</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {medications.map((med) => (
        <li
          key={med.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface-card p-3"
        >
          <Thumbnail photoBase64={med.photoBase64} />
          <div className="flex-1">
            <div className="font-medium text-text-primary">{med.name}</div>
            <div className="text-xs text-text-secondary">
              {med.type}
              {med.moClass ? ` · ${med.moClass}` : ''}
            </div>
          </div>
          <button type="button" onClick={() => onEdit(med.id)} aria-label="แก้ไข" className="text-text-secondary">
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(med.id)}
            aria-label="ลบ"
            className="text-severity-3-text"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default MedicationList
