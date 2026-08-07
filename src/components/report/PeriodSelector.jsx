import { PERIOD_PRESETS } from '../../lib/reportPeriods'

function PeriodSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {PERIOD_PRESETS.map((p) => {
        const selected = value === p.key
        return (
          <button
            key={p.key}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(p.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface-card text-text-primary'
            }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}

export default PeriodSelector
