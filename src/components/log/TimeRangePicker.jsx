// Both times are always freely editable — most logging happens after the pain has
// already eased, not live while it's happening, so painStart is often filled in
// retroactively (see docs/puadhead-spec-handoff.md section 2).
function TimeRangePicker({ painStart, painEnd, onChangeStart, onChangeEnd }) {
  return (
    <div className="flex gap-3">
      <label className="flex flex-1 flex-col gap-1 text-sm text-text-secondary">
        เวลาเริ่มปวด
        <input
          type="time"
          value={painStart ?? ''}
          onChange={(e) => onChangeStart(e.target.value || null)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>
      <label className="flex flex-1 flex-col gap-1 text-sm text-text-secondary">
        เวลาหาย
        <input
          type="time"
          value={painEnd ?? ''}
          onChange={(e) => onChangeEnd(e.target.value || null)}
          className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
        />
      </label>
    </div>
  )
}

export default TimeRangePicker
