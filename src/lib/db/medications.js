import { getDb, MEDICATIONS_STORE } from './db'

export async function getMedication(id) {
  const db = await getDb()
  return db.get(MEDICATIONS_STORE, id)
}

export async function putMedication(medication) {
  const db = await getDb()
  return db.put(MEDICATIONS_STORE, medication)
}

export async function deleteMedication(id) {
  const db = await getDb()
  return db.delete(MEDICATIONS_STORE, id)
}

export async function getAllMedications() {
  const db = await getDb()
  return db.getAll(MEDICATIONS_STORE)
}

const DEV_SEED_MEDICATIONS = [
  {
    id: 'med_001',
    name: 'พาราเซตามอล',
    type: 'acute',
    moClass: 'simple_analgesic',
    scheduledFrequency: null,
    maxDosePerDay: null,
  },
  {
    id: 'med_002',
    name: 'Flunarizine 5mg',
    type: 'preventive',
    moClass: null,
    scheduledFrequency: 'daily_before_bed',
    notes: 'ห้ามใช้ในผู้ป่วยพาร์กินสัน',
  },
  {
    id: 'med_003',
    name: 'Nurtec ODT 75mg',
    type: 'hybrid',
    moClass: 'gepant',
    scheduledFrequency: 'every_other_day',
    escalationRule: 'เพิ่มเป็นวันละ 1 เม็ดได้หากมีอาการปวด',
  },
]

// Dev-only convenience: seeds the sample medications from docs/puadhead-spec-handoff.md
// section 2 so the catalog isn't empty while building the UI. No-ops if data already exists.
export async function seedMedicationsIfEmpty() {
  const existing = await getAllMedications()
  if (existing.length > 0) return
  const db = await getDb()
  const tx = db.transaction(MEDICATIONS_STORE, 'readwrite')
  await Promise.all([
    ...DEV_SEED_MEDICATIONS.map((med) => tx.store.put(med)),
    tx.done,
  ])
}
