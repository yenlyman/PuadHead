import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthGate from './components/nav/AuthGate'
import MainLayout from './components/nav/MainLayout'
import DashboardPage from './pages/DashboardPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'
import QuickLogPage from './pages/QuickLogPage'
import MedicationListPage from './pages/MedicationListPage'
import MedicationFormPage from './pages/MedicationFormPage'
import DiagnosisListPage from './pages/DiagnosisListPage'
import DiagnosisFormPage from './pages/DiagnosisFormPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/log/new" element={<QuickLogPage mode="add" />} />
          <Route path="/log/:entryId" element={<QuickLogPage mode="edit" />} />
          <Route path="/medications" element={<MedicationListPage />} />
          <Route path="/medications/new" element={<MedicationFormPage mode="add" />} />
          <Route path="/medications/:id" element={<MedicationFormPage mode="edit" />} />
          <Route path="/diagnoses" element={<DiagnosisListPage />} />
          <Route path="/diagnoses/new" element={<DiagnosisFormPage mode="add" />} />
          <Route path="/diagnoses/:id" element={<DiagnosisFormPage mode="edit" />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  )
}

export default App
