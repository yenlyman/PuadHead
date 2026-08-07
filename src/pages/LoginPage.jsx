import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { captureLinkableCredential, resetPassword, signInWithEmail, signInWithGoogle, signUpWithEmail } from '../lib/auth'
import { useAuthStore } from '../store/useAuthStore'
import TaskScreenHeader from '../components/nav/TaskScreenHeader'

const ERROR_MESSAGES = {
  'auth/unauthorized-domain': 'โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Console (Authentication → Settings → Authorized domains)',
  'auth/operation-not-allowed': 'ยังไม่ได้เปิด sign-in method นี้ใน Firebase Console',
  'auth/access-denied':
    'บัญชีนี้ยังไม่ได้รับอนุญาต — ถ้า OAuth consent screen อยู่ในโหมด Testing ต้องเพิ่มอีเมลนี้เป็น test user ใน Google Cloud Console ก่อน',
  'auth/popup-blocked': 'เบราว์เซอร์บล็อก popup ไว้ — อนุญาต popup สำหรับเว็บนี้แล้วลองใหม่',
  'auth/email-already-in-use': 'อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน',
  'auth/weak-password': 'รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร',
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
  'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/missing-password': 'กรุณากรอกรหัสผ่าน',
  'auth/account-exists-with-different-credential':
    'อีเมลนี้เคยสมัครด้วยรหัสผ่านไว้แล้ว เข้าสู่ระบบด้วยอีเมล/รหัสผ่านด้านล่างหนึ่งครั้ง แล้วระบบจะเชื่อมบัญชี Google ให้อัตโนมัติ',
}

// User just closing the popup isn't a real failure — don't show a scary error for it.
const IGNORED_ERROR_CODES = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request'])

// Google's official 4-color "G" mark, inline so it renders without a network request.
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
      />
      <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.95a9 9 0 0 0 0 8.06l3-2.33z" />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  )
}

function setError(err) {
  if (IGNORED_ERROR_CODES.has(err.code)) return
  captureLinkableCredential(err)
  console.error('sign-in failed', err)
  useAuthStore.setState({ authError: err.code ?? err.message ?? 'เข้าสู่ระบบไม่สำเร็จ' })
}

function LoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const authError = useAuthStore((state) => state.authError)
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  // Login is opt-in now (tapped via SyncStatusBadge, not a forced gate) — once it
  // succeeds, return automatically to wherever the user came from.
  useEffect(() => {
    if (user) navigate(-1)
  }, [user, navigate])

  async function handleGoogleClick() {
    useAuthStore.setState({ authError: null })
    signInWithGoogle().catch(setError)
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    useAuthStore.setState({ authError: null })
    setResetSent(false)
    setSubmitting(true)
    try {
      await (mode === 'signup' ? signUpWithEmail(email, password) : signInWithEmail(email, password))
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      useAuthStore.setState({ authError: 'auth/invalid-email' })
      return
    }
    useAuthStore.setState({ authError: null })
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col p-6">
      <TaskScreenHeader title="เข้าสู่ระบบ" onBack={() => navigate(-1)} icon="close" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <img src="/icons/icon-192.png" alt="" className="h-20 w-20 rounded-2xl" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text-primary">บันทึกอาการปวดหัว</h1>
          <p className="text-sm text-text-secondary">
            เข้าสู่ระบบเพื่อบันทึกและดูข้อมูลเดียวกันได้จากทุกเครื่อง
          </p>
        </div>

      <button
        type="button"
        onClick={handleGoogleClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-card py-3 font-medium text-text-primary"
      >
        <GoogleMark />
        เข้าสู่ระบบด้วย Google
      </button>

      <div className="flex w-full items-center gap-3 text-xs text-text-muted">
        <div className="h-px flex-1 bg-border" />
        หรือ
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSubmit} className="flex w-full flex-col gap-3">
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          className="w-full rounded-xl border border-border bg-surface-card px-4 py-3 text-text-primary outline-none"
        />
        <input
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="w-full rounded-xl border border-border bg-surface-card px-4 py-3 text-text-primary outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'กำลังดำเนินการ...' : mode === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบด้วยอีเมล'}
        </button>
      </form>

      <div className="flex w-full items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
          className="text-text-secondary underline"
        >
          {mode === 'signup' ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
        </button>
        {mode === 'signin' && (
          <button type="button" onClick={handleForgotPassword} className="text-text-secondary underline">
            ลืมรหัสผ่าน?
          </button>
        )}
      </div>

        {resetSent && <p className="text-sm text-text-secondary">ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว</p>}
        {authError && (
          <p className="text-sm text-severity-3-text">
            {ERROR_MESSAGES[authError] ?? `เข้าสู่ระบบไม่สำเร็จ: ${authError}`}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoginPage
