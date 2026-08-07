import { getDb, ENTRIES_STORE } from './db'

export function generateEntryId(date) {
  const compact = date.replace(/-/g, '')
  const random = crypto.randomUUID().slice(0, 8)
  return `entry_${compact}_${random}`
}

export async function getEntry(entryId) {
  const db = await getDb()
  return db.get(ENTRIES_STORE, entryId)
}

export async function putEntry(entry) {
  const db = await getDb()
  return db.put(ENTRIES_STORE, entry)
}

export async function deleteEntry(entryId) {
  const db = await getDb()
  return db.delete(ENTRIES_STORE, entryId)
}

export async function getAllEntries() {
  const db = await getDb()
  return db.getAll(ENTRIES_STORE)
}

// startDate/endDate are inclusive ISO date strings (YYYY-MM-DD).
export async function getEntriesInRange(startDate, endDate) {
  const db = await getDb()
  return db.getAllFromIndex(ENTRIES_STORE, 'by-date', IDBKeyRange.bound(startDate, endDate))
}

export async function getEntriesForDate(date) {
  const db = await getDb()
  return db.getAllFromIndex(ENTRIES_STORE, 'by-date', date)
}
