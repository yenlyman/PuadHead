import { AlertTriangle } from 'lucide-react'

const MOCLASS_LABELS = {
  simple_analgesic: 'ยาแก้ปวดทั่วไป',
  NSAID: 'ยากลุ่ม NSAID',
  triptan: 'ยากลุ่ม Triptan',
  ergot: 'ยากลุ่ม Ergot',
  opioid: 'ยากลุ่ม Opioid',
  gepant: 'ยากลุ่ม Gepant',
}

const LEVEL_CLASSES = {
  warning: 'bg-severity-2-bg text-severity-2-text',
  critical: 'bg-severity-3-bg text-severity-3-text',
}

// risks: output of checkOveruseRisk(), pre-filtered by the caller to level !== 'safe'.
function OveruseAlertBanner({ risks }) {
  const alerts = risks.filter((risk) => risk.level === 'warning' || risk.level === 'critical')
  if (alerts.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((risk) => (
        <div
          key={risk.moClass}
          className={`flex items-center gap-2 rounded-xl px-4 py-3 ${LEVEL_CLASSES[risk.level]}`}
        >
          <AlertTriangle size={20} className="shrink-0" />
          <span className="text-sm">
            {MOCLASS_LABELS[risk.moClass] ?? risk.moClass}: ใช้ไป {risk.days}/{risk.limit} วัน ใน 30 วันล่าสุด
          </span>
        </div>
      ))}
    </div>
  )
}

export default OveruseAlertBanner
