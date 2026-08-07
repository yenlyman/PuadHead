import { ChevronLeft, X } from 'lucide-react'

// Task-screens (quick-log, edit-entry, add/edit medication) have no tab bar — every
// one of them uses this back/close pattern in its place, per design-reference.md.
function TaskScreenHeader({ title, onBack, icon = 'back' }) {
  const Icon = icon === 'close' ? X : ChevronLeft
  return (
    <header className="flex items-center justify-between py-4">
      <button
        type="button"
        onClick={onBack}
        aria-label={icon === 'close' ? 'ปิด' : 'ย้อนกลับ'}
        className="text-text-secondary"
      >
        <Icon size={22} />
      </button>
      <span className="text-sm font-medium text-text-primary">{title}</span>
    </header>
  )
}

export default TaskScreenHeader
