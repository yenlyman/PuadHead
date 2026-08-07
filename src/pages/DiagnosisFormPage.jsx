import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDiagnosesStore } from '../store/useDiagnosesStore'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'
import DiagnosisForm from '../components/diagnoses/DiagnosisForm'

function DiagnosisFormPage({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const diagnoses = useDiagnosesStore((state) => state.diagnoses)
  const loaded = useDiagnosesStore((state) => state.loaded)
  const load = useDiagnosesStore((state) => state.load)
  const save = useDiagnosesStore((state) => state.save)
  const remove = useDiagnosesStore((state) => state.remove)
  const [diagnosis, setDiagnosis] = useState(null)
  const [ready, setReady] = useState(mode === 'add')

  useEffect(() => {
    load()
  }, [load])

  // Reads from the already-loaded diagnoses store instead of fetching by ID directly —
  // same reasoning as MedicationFormPage/QuickLogPage (hybrid store: Firestore when
  // signed in, IndexedDB as a guest).
  useEffect(() => {
    if (mode !== 'edit' || !loaded) return
    setDiagnosis(diagnoses.find((d) => d.diagnosisId === id) ?? null)
    setReady(true)
  }, [mode, id, diagnoses, loaded])

  async function handleSave(diagnosisRecord) {
    await save(diagnosisRecord)
    navigate(-1)
  }

  async function handleDelete() {
    if (!window.confirm('ลบผลวินิจฉัยนี้ใช่ไหม?')) return
    await remove(id)
    navigate('/diagnoses')
  }

  if (!ready) return null

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <TaskScreenHeader
        title={mode === 'add' ? 'เพิ่มผลวินิจฉัย' : 'แก้ไขผลวินิจฉัย'}
        onBack={() => navigate(-1)}
        icon={mode === 'add' ? 'close' : 'back'}
      />
      <DiagnosisForm diagnosis={diagnosis} onSave={handleSave} onCancel={() => navigate(-1)} />
      {mode === 'edit' && (
        <button
          type="button"
          onClick={handleDelete}
          className="mt-3 w-full text-center text-sm text-severity-3-text"
        >
          ลบผลวินิจฉัยนี้
        </button>
      )}
    </div>
  )
}

export default DiagnosisFormPage
