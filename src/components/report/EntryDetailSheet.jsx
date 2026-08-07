import { Droplet, Pencil, Syringe, X } from 'lucide-react'
import { ALL_SYMPTOMS } from '../../lib/symptoms'
import { LOCATIONS } from '../../lib/locations'

const SEVERITY_CLASS = {
  1: 'bg-border text-text-primary',
  2: 'bg-severity-2-bg text-severity-2-text',
  3: 'bg-severity-3-bg text-severity-3-text',
}

const SEVERITY_LABELS = {
  1: { label: 'ระดับ 1', description: 'ปวดเล็กน้อย ยังทำกิจกรรมได้' },
  2: { label: 'ระดับ 2', description: 'ปวดปานกลาง รบกวนการทำกิจกรรม' },
  3: { label: 'ระดับ 3', description: 'ปวดรุนแรง ทำกิจกรรมไม่ได้' },
}

// Read-only by default — Report's EntryList already has its own pencil icon on the row,
// so no onEdit is passed there (a button in here would be a second, redundant path).
// Dashboard's heatmap passes onEdit instead: a calendar day cell has no room for its own
// pencil, so this popup is the only place an edit affordance can live for that entry point.
function EntryDetailSheet({ entry, medications, onEdit, onClose }) {
  if (!entry) return null

  const medById = new Map(medications.map((m) => [m.id, m]))
  const medNames = (entry.medications ?? [])
    .map((m) => medById.get(m.medicationId)?.name)
    .filter(Boolean)
  const activeSymptoms = ALL_SYMPTOMS.filter(({ key }) => entry.symptoms?.[key])
  const activeLocations = LOCATIONS.filter(({ key }) => entry.location?.includes(key))
  const severity = SEVERITY_LABELS[entry.severity]

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-t-2xl bg-surface-card p-4"
        style={{ paddingBottom: 'calc(24px + var(--safe-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium text-text-primary">{entry.date}</span>
          <div className="flex items-center gap-3">
            {onEdit && (
              <button type="button" onClick={onEdit} aria-label="แก้ไข" className="text-text-secondary">
                <Pencil size={18} />
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="ปิด" className="text-text-secondary">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${SEVERITY_CLASS[entry.severity]}`}
            >
              {entry.severity}
            </span>
            <div>
              <div className="font-medium text-text-primary">{severity?.label}</div>
              <div className="text-sm text-text-secondary">{severity?.description}</div>
            </div>
          </div>

          <div className="text-sm text-text-secondary">
            เวลาปวด:{' '}
            <span className="text-text-primary">
              {entry.painStart ?? '—'}–{entry.painEnd ?? '—'}
            </span>
          </div>

          <div className="text-sm text-text-secondary">
            ยาที่ใช้: <span className="text-text-primary">{medNames.length ? medNames.join(', ') : 'ไม่ได้ทานยา'}</span>
          </div>

          {activeSymptoms.length > 0 && (
            <div className="flex flex-col gap-1.5 text-sm text-text-secondary">
              อาการ
              <div className="flex flex-wrap gap-3">
                {activeSymptoms.map(({ key, label, Icon }) => (
                  <span key={key} className="flex items-center gap-1 text-text-primary">
                    <Icon size={14} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeLocations.length > 0 && (
            <div className="flex flex-col gap-1.5 text-sm text-text-secondary">
              ตำแหน่งที่ปวด
              <div className="flex flex-wrap gap-2">
                {activeLocations.map(({ key, label }) => (
                  <span
                    key={key}
                    className="rounded-full border border-border px-2.5 py-0.5 text-text-primary"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(entry.isMenstruating || entry.cgrpInjectionDay) && (
            <div className="flex flex-wrap gap-3 text-sm text-text-primary">
              {entry.isMenstruating && (
                <span className="flex items-center gap-1">
                  <Droplet size={14} /> มีประจำเดือน
                </span>
              )}
              {entry.cgrpInjectionDay && (
                <span className="flex items-center gap-1">
                  <Syringe size={14} /> วันฉีดยา CGRP
                </span>
              )}
            </div>
          )}

          {entry.notes && (
            <div className="flex flex-col gap-1 text-sm text-text-secondary">
              โน้ต
              <p className="whitespace-pre-wrap text-text-primary">{entry.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntryDetailSheet
