import { create } from 'zustand'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sanitize } from '../lib/firestoreSanitize'
import { blobToBase64 } from '../lib/images'
import { useAuthStore } from './useAuthStore'
import { deleteMedication, getAllMedications, putMedication } from '../lib/db/medications'

// Hybrid read-through cache, same pattern as useEntriesStore (see its comment) — signed
// in talks to Firestore, signed-out ("guest") falls back to this device's IndexedDB.
// `save()` also handles the Blob->base64 conversion so callers (MedicationForm) can keep
// passing a raw Blob for a newly-picked photo, regardless of which backend is active.
let unsubscribe = null
let subscribedUid = null

export const useMedicationsStore = create((set, get) => ({
  medications: [],
  loaded: false,

  load() {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      unsubscribe?.()
      unsubscribe = null
      subscribedUid = null
      getAllMedications().then((medications) => set({ medications, loaded: true }))
      return
    }
    if (subscribedUid === uid) return
    unsubscribe?.()
    subscribedUid = uid
    const q = query(collection(db, 'medications'), where('uid', '==', uid))
    unsubscribe = onSnapshot(q, (snapshot) => {
      set({ medications: snapshot.docs.map((d) => d.data()), loaded: true })
    })
  },

  async save(medication) {
    const uid = useAuthStore.getState().user?.uid
    const { photoBlob, ...rest } = medication
    // A newly-picked photo arrives as a raw Blob (from resizeAndCompressImage) and
    // wins over any stale photoBase64 the form still carries from the loaded record;
    // no new photo means rest.photoBase64 already reflects the current/removed state.
    const photoBase64 = photoBlob ? await blobToBase64(photoBlob) : (rest.photoBase64 ?? null)
    if (!uid) {
      await putMedication({ ...rest, photoBase64 })
      await get().load()
      return
    }
    await setDoc(doc(db, 'medications', medication.id), sanitize({ ...rest, photoBase64, uid }))
  },

  async remove(id) {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      await deleteMedication(id)
      await get().load()
      return
    }
    await deleteDoc(doc(db, 'medications', id))
  },

  // Clears the Firestore subscription only — reloading as a guest afterward is the
  // caller's job (see SettingsPage's handleSignOut), same reasoning as useEntriesStore.
  reset() {
    unsubscribe?.()
    unsubscribe = null
    subscribedUid = null
    set({ medications: [], loaded: false })
  },
}))
