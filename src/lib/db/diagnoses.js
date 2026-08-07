import { getDb, DIAGNOSES_STORE } from './db'

export function generateDiagnosisId() {
  return `diag_${crypto.randomUUID().slice(0, 8)}`
}

export async function getDiagnosis(diagnosisId) {
  const db = await getDb()
  return db.get(DIAGNOSES_STORE, diagnosisId)
}

export async function putDiagnosis(diagnosis) {
  const db = await getDb()
  return db.put(DIAGNOSES_STORE, diagnosis)
}

export async function deleteDiagnosis(diagnosisId) {
  const db = await getDb()
  return db.delete(DIAGNOSES_STORE, diagnosisId)
}

export async function getAllDiagnoses() {
  const db = await getDb()
  return db.getAll(DIAGNOSES_STORE)
}
