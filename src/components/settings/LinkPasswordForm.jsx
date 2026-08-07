import { useState } from 'react'
import { linkPasswordToCurrentUser } from '../../lib/auth'

// Shown only for accounts that don't already have a password provider linked (e.g.
// someone who signed up via Google) — lets them add email/password as a second way
// into the SAME account, rather than accidentally creating a separate one later.
function LinkPasswordForm({ email }) {
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await linkPasswordToCurrentUser(email, password)
      setDone(true)
    } catch (err) {
      console.error('linkPasswordToCurrentUser failed', err)
      setError(err.code === 'auth/weak-password' ? 'รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร' : 'ตั้งรหัสผ่านไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return <p className="text-sm text-text-secondary">ตั้งรหัสผ่านสำเร็จ — เข้าสู่ระบบด้วยอีเมล/รหัสผ่านนี้ได้แล้ว</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-xs text-text-secondary">
        บัญชีนี้เข้าผ่าน Google อย่างเดียว — ตั้งรหัสผ่านไว้เผื่อเข้าด้วยอีเมล/รหัสผ่านจากเครื่องอื่นได้ด้วย
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ตั้งรหัสผ่าน"
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          ตั้งรหัสผ่าน
        </button>
      </div>
      {error && <p className="text-xs text-severity-3-text">{error}</p>}
    </form>
  )
}

export default LinkPasswordForm
