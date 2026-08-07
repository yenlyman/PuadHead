export const VISIT_TYPE_OPTIONS = [
  { value: 'initial', label: 'วินิจฉัยครั้งแรก' },
  { value: 'followup', label: 'ติดตามอาการ' },
  { value: 'medicationAdjust', label: 'ปรับยา' },
  { value: 'additionalTests', label: 'ตรวจเพิ่มเติม' },
  { value: 'other', label: 'อื่นๆ' },
]

export const VISIT_TYPE_LABEL = Object.fromEntries(VISIT_TYPE_OPTIONS.map((opt) => [opt.value, opt.label]))
