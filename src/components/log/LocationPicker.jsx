import { MapPin } from 'lucide-react'
import { LOCATIONS } from '../../lib/locations'

// value: array of selected location keys — pain can be felt in more than one spot at once.
// Text pills, not icon toggles like SymptomToggles — there's no meaningful icon set for
// "ขมับ"/"ท้ายทอย" etc., same reasoning as MedicationChips.
function LocationPicker({ value, onChange }) {
  function toggle(key) {
    onChange(value.includes(key) ? value.filter((v) => v !== key) : [...value, key])
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
        <MapPin size={16} />
        ตำแหน่งที่ปวด
      </div>
      <div className="flex flex-wrap gap-2">
        {LOCATIONS.map(({ key, label }) => {
          const selected = value.includes(key)
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(key)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-surface-card text-text-primary'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LocationPicker
