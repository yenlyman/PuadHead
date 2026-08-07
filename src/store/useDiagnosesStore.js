import { create } from 'zustand'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sanitize } from '../lib/firestoreSanitize'
import { blobToBase64 } from '../lib/images'
import { useAuthStore } from './useAuthStore'
import { deleteDiagnosis, getAllDiagnoses, putDiagnosis } from '../lib/db/diagnoses'

// Hybrid read-through cache, same pattern as useMedicationsStore — signed in talks to
// Firestore, signed-out ("guest") falls back to this device's IndexedDB.
let unsubscribe = null
let subscribedUid = null

export const useDiagnosesStore = create((set, get) => ({
  diagnoses: [],
  loaded: false,

  load() {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      unsubscribe?.()
      unsubscribe = null
      subscribedUid = null
      getAllDiagnoses().then((diagnoses) => set({ diagnoses, loaded: true }))
      return
    }
    if (subscribedUid === uid) return
    unsubscribe?.()
    subscribedUid = uid
    const q = query(collection(db, 'diagnoses'), where('uid', '==', uid))
    unsubscribe = onSnapshot(q, (snapshot) => {
      set({ diagnoses: snapshot.docs.map((d) => d.data()), loaded: true })
    })
  },

  async save(diagnosis) {
    const uid = useAuthStore.getState().user?.uid
    const { photoBlob, ...rest } = diagnosis
    const photoBase64 = photoBlob ? await blobToBase64(photoBlob) : (rest.photoBase64 ?? null)
    if (!uid) {
      await putDiagnosis({ ...rest, photoBase64 })
      await get().load()
      return
    }
    await setDoc(doc(db, 'diagnoses', diagnosis.diagnosisId), sanitize({ ...rest, photoBase64, uid }))
  },

  async remove(diagnosisId) {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      await deleteDiagnosis(diagnosisId)
      await get().load()
      return
    }
    await deleteDoc(doc(db, 'diagnoses', diagnosisId))
  },

  reset() {
    unsubscribe?.()
    unsubscribe = null
    subscribedUid = null
    set({ diagnoses: [], loaded: false })
  },
}))
