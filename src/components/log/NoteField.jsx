import { useState } from 'react'
import { NotebookPen } from 'lucide-react'

// Collapsed by default (a "+ เพิ่มโน้ต" link) so the fast-entry flow stays uncluttered
// for the common case of not needing one — expands into a textarea once tapped, or
// automatically if the entry already has a note (editing an existing one).
function NoteField({ value, onChange }) {
  const [expanded, setExpanded] = useState(Boolean(value))

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1.5 self-start text-sm text-text-secondary underline"
      >
        <NotebookPen size={14} />
        เพิ่มโน้ต
      </button>
    )
  }

  return (
    <label className="flex flex-col gap-1 text-sm text-text-secondary">
      โน้ตเพิ่มเติม
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="เช่น สิ่งที่หมอ/เภสัชบอก, สาเหตุที่คิดว่าทำให้ปวด"
        className="rounded-lg border border-border bg-surface-card p-2 text-text-primary"
      />
    </label>
  )
}

export default NoteField
