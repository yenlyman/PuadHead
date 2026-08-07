import { create } from 'zustand'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sanitize } from '../lib/firestoreSanitize'
import { useAuthStore } from './useAuthStore'
import { deleteEntry, getAllEntries, putEntry } from '../lib/db/entries'

// Hybrid read-through cache: signed-in uses a live Firestore onSnapshot listener
// (cross-device sync); signed-out ("guest") falls back to this device's IndexedDB —
// firestore.rules requires request.auth != null, so a guest literally cannot read/write
// Firestore. External shape (entries/loaded/load/save/remove/reset) stays identical
// either way so page components never need to know which backend is active.
let unsubscribe = null
let subscribedUid = null

export const useEntriesStore = create((set, get) => ({
  entries: [],
  loaded: false,

  load() {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      unsubscribe?.()
      unsubscribe = null
      subscribedUid = null
      getAllEntries().then((entries) => set({ entries, loaded: true }))
      return
    }
    if (subscribedUid === uid) return
    unsubscribe?.()
    subscribedUid = uid
    const q = query(collection(db, 'entries'), where('uid', '==', uid))
    unsubscribe = onSnapshot(q, (snapshot) => {
      set({ entries: snapshot.docs.map((d) => d.data()), loaded: true })
    })
  },

  async save(entry) {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      await putEntry(entry)
      await get().load()
      return
    }
    await setDoc(doc(db, 'entries', entry.entryId), sanitize({ ...entry, uid }))
  },

  async remove(entryId) {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      await deleteEntry(entryId)
      await get().load()
      return
    }
    await deleteDoc(doc(db, 'entries', entryId))
  },

  // Clears the Firestore subscription only — reloading as a guest afterward is the
  // caller's job (see SettingsPage's handleSignOut) since signOutUser() must resolve
  // first, otherwise load() would still see the old uid and resubscribe immediately.
  reset() {
    unsubscribe?.()
    unsubscribe = null
    subscribedUid = null
    set({ entries: [], loaded: false })
  },
}))
