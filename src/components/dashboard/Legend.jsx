const ITEMS = [
  { label: 'ไม่มีบันทึก', swatchClass: 'bg-surface border border-border' },
  { label: 'ระดับ 1', swatchClass: 'bg-surface-card border border-border' },
  { label: 'ระดับ 2', swatchClass: 'bg-severity-2-bg' },
  { label: 'ระดับ 3', swatchClass: 'bg-severity-3-bg' },
]

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded ${item.swatchClass}`} />
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default Legend
