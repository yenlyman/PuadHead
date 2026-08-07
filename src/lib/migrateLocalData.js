import { doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { sanitize } from './firestoreSanitize'
import { blobToBase64 } from './images'
import { getAllEntries } from './db/entries'
import { getAllMedications } from './db/medications'
import { getAllDiagnoses } from './db/diagnoses'

function flagKey(uid) {
  return `puadhead_migrated_${uid}`
}

// One-time import of whatever's already in this device's IndexedDB (Phase 1 data,
// entered before Firestore sync existed) into the signed-in user's Firestore documents.
// Guarded by a localStorage flag so it only ever runs once per uid per device — safe to
// call on every sign-in. Existing entryId/id values become the Firestore document ID,
// so re-running (e.g. flag cleared) overwrites rather than duplicates.
export async function migrateLocalDataIfNeeded(uid) {
  if (localStorage.getItem(flagKey(uid))) return

  const [entries, medications, diagnoses] = await Promise.all([
    getAllEntries(),
    getAllMedications(),
    getAllDiagnoses(),
  ])

  await Promise.all([
    ...entries.map((entry) => setDoc(doc(db, 'entries', entry.entryId), sanitize({ ...entry, uid }))),
    ...medications.map(async (med) => {
      const { photoBlob, ...rest } = med
      const photoBase64 = photoBlob ? await blobToBase64(photoBlob) : null
      return setDoc(doc(db, 'medications', med.id), sanitize({ ...rest, photoBase64, uid }))
    }),
    ...diagnoses.map(async (diagnosis) => {
      const { photoBlob, ...rest } = diagnosis
      const photoBase64 = photoBlob ? await blobToBase64(photoBlob) : (rest.photoBase64 ?? null)
      return setDoc(doc(db, 'diagnoses', diagnosis.diagnosisId), sanitize({ ...rest, photoBase64, uid }))
    }),
  ])

  localStorage.setItem(flagKey(uid), '1')
}
