// value: array of selected medication ids — multiple meds can be taken in one episode
// (e.g. paracetamol first, then a triptan if it doesn't help).
function MedicationChips({ medications, value, onChange }) {
  if (medications.length === 0) {
    return <p className="text-sm text-text-muted">ยังไม่มียาในระบบ กดปุ่ม "จัดการยา" ด้านบนเพื่อเพิ่ม</p>
  }

  function toggle(id) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {medications.map((med) => {
        const selected = value.includes(med.id)
        return (
          <button
            key={med.id}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(med.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              selected
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-surface-card text-text-primary'
            }`}
          >
            {med.name}
          </button>
        )
      })}
    </div>
  )
}

export default MedicationChips
