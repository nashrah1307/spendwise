import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Eye, EyeOff, Check, TrendingUp } from "lucide-react"
import { authAPI } from "../../services/api"

export default function ResetPassword() {
  const navigate = useNavigate()
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!password || password.length < 6) { setError("Password must be at least 6 characters"); return }
    if (password !== confirm) { setError("Passwords do not match"); return }
    setError("")
    setLoading(true)
    try {
      await authAPI.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or expired")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
        .auth-input:focus { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.08); }
        .btn-primary { width: 100%; background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>SpendWise</span>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={28} color="#34d399" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Password Reset!</h2>
            <p style={{ color: "#9ca3af", fontSize: 14 }}>Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Set New Password</h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, textAlign: "center" }}>
              Choose a new password for your account.
            </p>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db", display: "block", marginBottom: 6 }}>New Password</label>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <input className="auth-input" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={password}
                onChange={e => { setPassword(e.target.value); setError("") }} style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", display: "flex" }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db", display: "block", marginBottom: 6 }}>Confirm Password</label>
            <input className="auth-input" type={showPass ? "text" : "password"} placeholder="Repeat your password" value={confirm}
              onChange={e => { setConfirm(e.target.value); setError("") }} style={{ marginBottom: 8 }} />
            {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>}

            <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 16 }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
