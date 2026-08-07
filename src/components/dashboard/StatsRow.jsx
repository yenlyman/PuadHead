function StatCard({ label, value }) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-surface-card p-4">
      <div className="text-sm text-text-secondary">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-text-primary">{value}</div>
    </div>
  )
}

function StatsRow({ headacheDays, medicationDays }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="วันที่ปวด" value={headacheDays} />
      <StatCard label="วันที่ทานยา" value={medicationDays} />
    </div>
  )
}

export default StatsRow
