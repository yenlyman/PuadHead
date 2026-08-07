import { openDB } from 'idb'

const DB_NAME = 'puadhead'
const DB_VERSION = 3

export const ENTRIES_STORE = 'entries'
export const MEDICATIONS_STORE = 'medications'
export const DIAGNOSES_STORE = 'diagnoses'

let dbPromise = null

// entries: keyPath 'entryId' — multiple entries per day are now allowed (rolled back
// from the v1 schema that keyed a single record by 'date'), so a 'by-date' index on the
// 'date' field is required for range queries (the primary key is no longer date-sortable).
// medications: keyPath 'id' — unchanged, small catalog, getAll() is fine.
// diagnoses: keyPath 'diagnosisId' — small catalog like medications, getAll() is fine.
export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (db.objectStoreNames.contains('dailyEntries')) {
          db.deleteObjectStore('dailyEntries')
        }
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const store = db.createObjectStore(ENTRIES_STORE, { keyPath: 'entryId' })
          store.createIndex('by-date', 'date')
        }
        if (!db.objectStoreNames.contains(MEDICATIONS_STORE)) {
          db.createObjectStore(MEDICATIONS_STORE, { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains(DIAGNOSES_STORE)) {
          db.createObjectStore(DIAGNOSES_STORE, { keyPath: 'diagnosisId' })
        }
      },
    })
  }
  return dbPromise
}
