const LEVELS = [
  { value: 1, label: 'ระดับ 1', description: 'ปวดเล็กน้อย ยังทำกิจกรรมได้', bgClass: 'bg-surface-card' },
  { value: 2, label: 'ระดับ 2', description: 'ปวดปานกลาง รบกวนการทำกิจกรรม', bgClass: 'bg-severity-2-bg' },
  { value: 3, label: 'ระดับ 3', description: 'ปวดรุนแรง ทำกิจกรรมไม่ได้', bgClass: 'bg-severity-3-bg' },
]

// compact=true drops the description text and tightens padding — used in cover-mode
// where the folded Flip7 screen has very little vertical room.
function SeverityPicker({ value, onChange, compact = false }) {
  return (
    <div role="radiogroup" aria-label="ระดับความปวด" className="flex flex-col gap-2">
      {LEVELS.map((level) => {
        const selected = value === level.value
        return (
          <button
            key={level.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(level.value)}
            className={`flex w-full items-center gap-3 rounded-xl border-2 text-left transition-colors ${compact ? 'p-2' : 'p-3'} ${level.bgClass} ${selected ? 'border-primary' : 'border-transparent'}`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-full bg-surface-card font-semibold text-text-primary ${compact ? 'h-8 w-8 text-sm' : 'h-10 w-10'}`}
            >
              {level.value}
            </span>
            <div>
              <div className="font-medium text-text-primary">{level.label}</div>
              {!compact && <div className="text-sm text-text-secondary">{level.description}</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default SeverityPicker
