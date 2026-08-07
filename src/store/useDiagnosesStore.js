import { create } from 'zustand'
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { sanitize } from '../lib/firestoreSanitize'
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
    if (!uid) {
      await putDiagnosis(diagnosis)
      await get().load()
      return
    }
    await setDoc(doc(db, 'diagnoses', diagnosis.diagnosisId), sanitize({ ...diagnosis, uid }))
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
