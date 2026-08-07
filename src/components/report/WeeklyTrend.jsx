// buckets: [{ start: isoDate, count: number }] — one entry per 7-day window.
function WeeklyTrend({ buckets }) {
  const max = Math.max(1, ...buckets.map((b) => b.count))

  return (
    <div className="flex h-24 gap-1.5 rounded-xl border border-border bg-surface-card p-3">
      {buckets.map((b) => (
        <div key={b.start} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={b.start}>
          <div
            className={`w-full rounded-t ${b.count > 0 ? 'bg-primary' : 'bg-border'}`}
            style={{ height: `${Math.max((b.count / max) * 100, 4)}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export default WeeklyTrend
