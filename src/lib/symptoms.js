import {
  Activity,
  Bone,
  Compass,
  Droplet,
  Ear,
  EyeOff,
  Frown,
  Hand,
  Moon,
  RotateCw,
  Sparkles,
  Speaker,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'

// Always visible in SymptomToggles — the original 4 symptoms this app shipped with.
export const PRIMARY_SYMPTOMS = [
  { key: 'photophobia', label: 'ไวต่อแสง', Icon: Sun },
  { key: 'phonophobia', label: 'ไวต่อเสียง', Icon: Speaker },
  { key: 'nausea', label: 'คลื่นไส้', Icon: Droplet },
  { key: 'aura', label: 'ออร่า', Icon: Sparkles },
]

// Hidden behind "ดูอาการเพิ่มเติม" in SymptomToggles until expanded.
export const EXTENDED_SYMPTOMS = [
  { key: 'osmophobia', label: 'ไวต่อกลิ่น', Icon: Wind },
  { key: 'vertigo', label: 'เวียนหัวบ้านหมุน', Icon: RotateCw },
  { key: 'blurredVision', label: 'มองเห็นไม่ชัด/ภาพเบลอ', Icon: EyeOff },
  { key: 'numbness', label: 'ชา/อ่อนแรงครึ่งซีก', Icon: Hand },
  { key: 'tinnitus', label: 'หูอื้อ/มีเสียงในหู', Icon: Ear },
  { key: 'imbalance', label: 'ทรงตัวไม่ได้/เดินเซ', Icon: Compass },
  { key: 'confusion', label: 'สับสน มึนงง คิดช้า', Icon: Frown },
  { key: 'fever', label: 'ไข้ร่วมด้วย', Icon: Thermometer },
  { key: 'fatigue', label: 'อ่อนเพลีย เหนื่อยง่าย', Icon: Activity },
  { key: 'neckStiffness', label: 'คอ/บ่าตึงแข็ง', Icon: Bone },
  { key: 'sleepDisturbance', label: 'นอนหลับผิดปกติ', Icon: Moon },
]

export const ALL_SYMPTOMS = [...PRIMARY_SYMPTOMS, ...EXTENDED_SYMPTOMS]

export const EMPTY_SYMPTOMS = Object.fromEntries(ALL_SYMPTOMS.map(({ key }) => [key, false]))
