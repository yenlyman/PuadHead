// Firestore's setDoc/addDoc throws on `undefined` field values, but a few of our object
// builders (MedicationForm, QuickLogPage) use `undefined` for "field intentionally left
// out" — this was harmless for IndexedDB. Strip it recursively before every Firestore write.
export function sanitize(value) {
  if (Array.isArray(value)) {
    return value.map(sanitize)
  }
  if (value !== null && typeof value === 'object') {
    const result = {}
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined) continue
      result[key] = sanitize(v)
    }
    return result
  }
  return value
}
