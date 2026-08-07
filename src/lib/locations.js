// Pain location — a different question from "อาการร่วม" (what else happened) and has no
// meaningful lucide icon set, so it's rendered as text pills (see LocationPicker.jsx)
// instead of an icon grid.
export const LOCATIONS = [
  { key: 'temple', label: 'ขมับ' },
  { key: 'occiput', label: 'ท้ายทอย' },
  { key: 'vertex', label: 'กระหม่อม/บนหัว' },
  { key: 'forehead', label: 'หน้าผาก' },
  { key: 'eyeSocket', label: 'เบ้าตา' },
  { key: 'wholeHead', label: 'ทั้งหัว' },
]

export const LOCATION_LABEL_BY_KEY = Object.fromEntries(LOCATIONS.map(({ key, label }) => [key, label]))
