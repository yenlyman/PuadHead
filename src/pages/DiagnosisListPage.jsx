import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDiagnosesStore } from '../store/useDiagnosesStore'
import { useMedicationsStore } from '../store/useMedicationsStore'
import DiagnosisList from '../components/diagnoses/DiagnosisList'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'

// Reached from the DiagnosisChip on Dashboard — the only entry point (see DiagnosisChip.jsx).
function DiagnosisListPage() {
  const navigate = useNavigate()
  const diagnoses = useDiagnosesStore((state) => state.diagnoses)
  const load = useDiagnosesStore((state) => state.load)
  const remove = useDiagnosesStore((state) => state.remove)
  const medications = useMedicationsStore((state) => state.medications)
  const loadMedications = useMedicationsStore((state) => state.load)

  useEffect(() => {
    load()
    loadMedications()
  }, [load, loadMedications])

  async function handleDelete(diagnosisId) {
    if (!window.confirm('ลบผลวินิจฉัยนี้ใช่ไหม?')) return
    await remove(diagnosisId)
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <TaskScreenHeader title="บันทึกผลวินิจฉัย" onBack={() => navigate(-1)} icon="back" />
      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/diagnoses/new')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white"
        >
          <Plus size={20} />
          เพิ่มผลวินิจฉัย
        </button>
        <DiagnosisList
          diagnoses={diagnoses}
          medications={medications}
          onEdit={(id) => navigate(`/diagnoses/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default DiagnosisListPage
