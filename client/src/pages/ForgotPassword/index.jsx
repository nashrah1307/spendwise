import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Check, TrendingUp } from "lucide-react"
import { authAPI } from "../../services/api"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Email is required"); return }
    setError("")
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; }
        .auth-input:focus { border-color: rgba(124,58,237,0.6); background: rgba(124,58,237,0.08); }
        .btn-primary { width: 100%; background: linear-gradient(135deg,#7c3aed,#6d28d9); color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <a onClick={() => navigate("/login")} style={{ position: "absolute", top: 28, left: 28, display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13, cursor: "pointer" }}>
        <ArrowLeft size={15} /> Back to login
      </a>

      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>SpendWise</span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={28} color="#34d399" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Check your email</h2>
            <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: "#fff" }}>{email}</strong>, we've sent a password reset link. It expires in 30 minutes.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Forgot Password?</h1>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28, textAlign: "center" }}>
              Enter your email and we'll send you a reset link.
            </p>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db", display: "block", marginBottom: 6 }}>Email Address</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setError("") }} style={{ marginBottom: 8 }} />
            {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>}

            <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Mail size={16} /> {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
