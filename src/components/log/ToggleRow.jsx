// Single on/off flag, full-width — distinct from the icon-card grids (SymptomToggles,
// LocationPicker) that are meant for picking from several options. A lone flag doesn't
// need that grid treatment, just a row with a clear on/off indicator.
function ToggleRow({ icon: Icon, label, active, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-surface-card text-text-secondary'
      }`}
    >
      <span className="flex items-center gap-2 text-sm">
        <Icon size={18} />
        {label}
      </span>
      <span
        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
          active ? 'border-primary bg-primary' : 'border-border'
        }`}
      />
    </button>
  )
}

export default ToggleRow
