import { useThemeStore } from '../../store/useThemeStore'

const OPTIONS = [
  { value: 'light', label: 'สว่าง' },
  { value: 'dark', label: 'มืด' },
  { value: 'system', label: 'ตามระบบ' },
]

function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => {
        const selected = mode === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => setMode(opt.value)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
              selected ? 'border-primary bg-primary text-white' : 'border-border bg-surface-card text-text-primary'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle
