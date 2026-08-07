import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMedicationsStore } from '../store/useMedicationsStore'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'
import MedicationForm from '../components/medications/MedicationForm'

function MedicationFormPage({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const medications = useMedicationsStore((state) => state.medications)
  const loaded = useMedicationsStore((state) => state.loaded)
  const load = useMedicationsStore((state) => state.load)
  const save = useMedicationsStore((state) => state.save)
  const [medication, setMedication] = useState(null)
  const [ready, setReady] = useState(mode === 'add')

  useEffect(() => {
    load()
  }, [load])

  // Reads from the already-loaded medications store instead of fetching by ID
  // directly — the store is hybrid (Firestore when signed in, IndexedDB as a guest),
  // so a direct IndexedDB lookup here would silently find nothing for a
  // Firestore-backed medication and leave the page blank forever.
  useEffect(() => {
    if (mode !== 'edit' || !loaded) return
    setMedication(medications.find((m) => m.id === id) ?? null)
    setReady(true)
  }, [mode, id, medications, loaded])

  async function handleSave(med) {
    await save(med)
    navigate(-1)
  }

  if (!ready) return null

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <TaskScreenHeader
        title={mode === 'add' ? 'เพิ่มยาใหม่' : 'แก้ไขยา'}
        onBack={() => navigate(-1)}
        icon={mode === 'add' ? 'close' : 'back'}
      />
      <MedicationForm medication={medication} onSave={handleSave} onCancel={() => navigate(-1)} />
    </div>
  )
}

export default MedicationFormPage
