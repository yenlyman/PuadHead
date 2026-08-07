import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useMedicationsStore } from '../store/useMedicationsStore'
import MedicationList from '../components/medications/MedicationList'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'

// Task-screen reached from QuickLogPage's "ยาที่ใช้" section — moved out of Settings,
// which should hold only real settings (theme, account/sync), not the medication
// catalog CRUD.
function MedicationListPage() {
  const navigate = useNavigate()
  const medications = useMedicationsStore((state) => state.medications)
  const load = useMedicationsStore((state) => state.load)
  const remove = useMedicationsStore((state) => state.remove)

  useEffect(() => {
    load()
  }, [load])

  async function handleDelete(id) {
    if (!window.confirm('ลบยานี้ใช่ไหม? บันทึกเก่าที่อ้างถึงยานี้จะยังอยู่แต่จะไม่โยงกับยานี้อีกต่อไป')) return
    await remove(id)
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <TaskScreenHeader title="จัดการยา" onBack={() => navigate(-1)} icon="back" />
      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/medications/new')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white"
        >
          <Plus size={20} />
          เพิ่มยาใหม่
        </button>
        <MedicationList
          medications={medications}
          onEdit={(id) => navigate(`/medications/${id}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}

export default MedicationListPage
