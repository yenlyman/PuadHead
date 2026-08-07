import { useState } from 'react'
import { ChevronDown, ChevronUp, Stethoscope } from 'lucide-react'
import { PRIMARY_SYMPTOMS, EXTENDED_SYMPTOMS } from '../../lib/symptoms'

function SymptomGrid({ symptoms, value, onChange }) {
  function toggle(key) {
    onChange({ ...value, [key]: !value[key] })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {symptoms.map(({ key, label, Icon }) => {
        const active = value[key]
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(key)}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors ${
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface-card text-text-secondary'
            }`}
          >
            <Icon size={22} />
            <span className="text-xs">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Extended list starts collapsed (a "ดูอาการเพิ่มเติม" link) so quick-entry stays fast for
// the common case — expands into the full grid once tapped, or automatically if the entry
// already has an extended symptom active (editing an existing one). Same pattern as
// NoteField.jsx's collapse/expand.
function SymptomToggles({ value, onChange }) {
  const [expanded, setExpanded] = useState(() => EXTENDED_SYMPTOMS.some(({ key }) => value[key]))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
        <Stethoscope size={16} />
        อาการร่วม
      </div>
      <SymptomGrid symptoms={PRIMARY_SYMPTOMS} value={value} onChange={onChange} />
      {expanded ? (
        <SymptomGrid symptoms={EXTENDED_SYMPTOMS} value={value} onChange={onChange} />
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 self-start text-sm text-text-secondary underline"
        >
          <ChevronDown size={14} />
          ดูอาการเพิ่มเติม
        </button>
      )}
      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="flex items-center gap-1.5 self-start text-sm text-text-secondary underline"
        >
          <ChevronUp size={14} />
          ซ่อนอาการเพิ่มเติม
        </button>
      )}
    </div>
  )
}

export default SymptomToggles
