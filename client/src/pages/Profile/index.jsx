import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import TopBar from "../../components/Topbar"
import { authAPI, transactionAPI, budgetAPI } from "../../services/api"
import {
  Camera, Mail, Phone, MapPin, Calendar,
  Shield, CreditCard, Check, Pencil, X
} from "lucide-react"

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
  padding: "11px 14px", color: "#fff", fontSize: 14,
  fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "all 0.2s"
}
const labelStyle = { fontSize: 13, fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: 6 }

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()

  // ── Load user from localStorage ──
  const storedUser = JSON.parse(localStorage.getItem("spendwise_user") || "{}")

  const [editing, setEditing]   = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  // ── Real stats from API ──
  const [stats, setStats] = useState({ transactions: 0, months: 0, saved: 0, budgets: 0 })

  const [form, setForm] = useState({
    name:     storedUser.name     || "",
    email:    storedUser.email    || "",
    phone:    storedUser.phone    || "",
    location: storedUser.location || "",
    dob:      storedUser.dob      || "",
    bio:      storedUser.bio      || "",
  })
  const [draft, setDraft] = useState({ ...form })

  // ── Fetch real stats on mount ──
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [txRes, budgetRes] = await Promise.all([
          transactionAPI.getAll(),
          budgetAPI.getAll(),
        ])

        const txs = txRes.data
        const budgets = budgetRes.data

        // Calculate total saved (sum of all income - expense)
        const totalIncome  = txs.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
        const totalExpense = txs.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
        const totalSaved   = totalIncome - totalExpense

        // Count unique months with transactions
        const months = new Set(txs.map(t => t.date?.substring(0, 7))).size

        setStats({
          transactions: txs.length,
          months,
          saved: totalSaved,
          budgets: budgets.length,
        })
      } catch (err) {
        console.error("Failed to load stats:", err)
      }
    }
    fetchStats()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.updateProfile({
        name:     draft.name,
        email:    draft.email,
        currency: storedUser.currency || "INR",
      })

      // Update localStorage with new user data
      const updatedUser = {
        ...storedUser,
        ...res.data,
        phone:    draft.phone,
        location: draft.location,
        dob:      draft.dob,
        bio:      draft.bio,
      }
      localStorage.setItem("spendwise_user", JSON.stringify(updatedUser))

      setForm({ ...draft })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => { setDraft({ ...form }); setEditing(false); setError(null) }
  const update = (k, v) => setDraft(d => ({ ...d, [k]: v }))

  // ── Avatar initials ──
  const initials = form.name
    ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  // ── Format saved amount ──
  const formatSaved = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    if (amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}k`
    return `₹${amount}`
  }

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes successPop { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        .page-animate { animation: fadeUp 0.5s ease; }
        .profile-input:focus { border-color: rgba(124,58,237,0.6) !important; background: rgba(124,58,237,0.08) !important; }
      `}</style>

      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <TopBar title="Profile" subtitle="Manage your personal information" />

        <div className="page-animate" style={{ padding: 28, maxWidth: 900 }}>

          {/* ── Save success toast ── */}
          {saved && (
            <div style={{ position: "fixed", bottom: 28, right: 28, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, zIndex: 200, animation: "successPop 0.3s ease" }}>
              <Check size={16} color="#34d399" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#34d399" }}>Profile updated!</span>
            </div>
          )}

          {/* ── Profile header ── */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px", marginBottom: 20, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 28, color: "#fff", border: "3px solid rgba(124,58,237,0.4)" }}>
                {initials}
              </div>
              <button style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: "#7c3aed", border: "2px solid #08080f", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={13} color="#fff" />
              </button>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{form.name || "Your Name"}</h2>
              <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 10 }}>{form.email}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {storedUser.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>✓ Verified</span>
              </div>
            </div>

            <button onClick={() => editing ? handleCancel() : setEditing(true)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
              background: editing ? "rgba(239,68,68,0.1)" : "rgba(124,58,237,0.15)",
              border: `1px solid ${editing ? "rgba(239,68,68,0.25)" : "rgba(124,58,237,0.3)"}`,
              borderRadius: 10, color: editing ? "#f87171" : "#a78bfa",
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
            }}>
              {editing ? <><X size={14} /> Cancel</> : <><Pencil size={14} /> Edit Profile</>}
            </button>
          </div>

          {/* ── Real stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard label="Transactions"   value={stats.transactions}       color="#a78bfa" />
            <StatCard label="Months Tracked" value={stats.months}             color="#06b6d4" />
            <StatCard label="Total Saved"    value={formatSaved(stats.saved)} color="#34d399" />
            <StatCard label="Budgets Set"    value={stats.budgets}            color="#f59e0b" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>

            {/* ── Personal info ── */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 24px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={16} color="#a78bfa" /> Personal Information
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { key: "name",     label: "Full Name",       type: "text" },
                  { key: "email",    label: "Email Address",   type: "email" },
                  { key: "phone",    label: "Phone Number",    type: "text" },
                  { key: "location", label: "Location",        type: "text" },
                  { key: "dob",      label: "Date of Birth",   type: "date" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    {editing ? (
                      <input className="profile-input" type={type} value={draft[key]} onChange={e => update(key, e.target.value)}
                        style={{ ...inputStyle, colorScheme: type === "date" ? "dark" : undefined }} />
                    ) : (
                      <div style={{ fontSize: 14, color: "#fff", padding: "11px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                        {form[key] || <span style={{ color: "#4b5563" }}>Not set</span>}
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <label style={labelStyle}>Bio</label>
                  {editing ? (
                    <textarea value={draft.bio} onChange={e => update("bio", e.target.value)}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.5 }} />
                  ) : (
                    <div style={{ fontSize: 14, color: "#d1d5db", padding: "11px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", lineHeight: 1.6 }}>
                      {form.bio || <span style={{ color: "#4b5563" }}>Add a bio...</span>}
                    </div>
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                    {error}
                  </div>
                )}

                {editing && (
                  <button onClick={handleSave} disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(124,58,237,0.35)", transition: "all 0.2s" }}>
                    <Check size={15} /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>

            {/* ── Right column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={16} color="#a78bfa" /> Account Security
                </div>
                {[
                  { label: "Password", value: "Update your password", action: "Change" },
                  { label: "Two-Factor Auth", value: "Not enabled", action: "Enable" },
                  { label: "Login Sessions", value: "1 active session", action: "Manage" },
                ].map(({ label, value, action }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{value}</div>
                    </div>
                    <button style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      {action}
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                  <CreditCard size={16} color="#a78bfa" /> Current Plan
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>You are on the free tier</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Free</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 18, lineHeight: 1.6 }}>Basic expense tracking, up to 100 transactions/month, standard reports.</div>
                <button style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                  Upgrade to Pro ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
