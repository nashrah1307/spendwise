import { useState } from "react"
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Bell, Moon, Globe, Shield, Trash2,
  ChevronRight, Check, ToggleLeft, ToggleRight
} from "lucide-react"

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ cursor: "pointer", color: value ? "#a78bfa" : "#4b5563", transition: "color 0.2s" }}>
      {value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </div>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db", marginBottom: 3 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "#6b7280" }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>{children}</div>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={16} color="#a78bfa" /> {title}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 14 }}>
        {children}
      </div>
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifs: true, pushNotifs: false, budgetAlerts: true,
    weeklyReport: true, monthlyReport: true,
    darkMode: true, compactView: false,
    currency: "INR", language: "English", dateFormat: "DD/MM/YYYY",
    twoFactor: false, dataSharing: false,
  })
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const update = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const selectStyle = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8, color: "#d1d5db", padding: "7px 12px", fontSize: 13,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", outline: "none",
    minWidth: 130
  }

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes successPop { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .page-animate { animation: fadeUp 0.5s ease; }
        select option { background: #13102a; color: #fff; }
      `}</style>

      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <Topbar title="Settings" subtitle="Manage your app preferences">
          <button onClick={handleSave} style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif', display:'flex', alignItems:'center', gap:6", boxShadow: "0 4px 14px rgba(124,58,237,0.3)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Save Changes
          </button>
        </Topbar>

        {/* Toast */}
        {saved && (
          <div style={{ position: "fixed", bottom: 28, right: 28, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, zIndex: 200, animation: "successPop 0.3s ease" }}>
            <Check size={16} color="#34d399" />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#34d399" }}>Settings saved!</span>
          </div>
        )}

        <div className="page-animate" style={{ padding: 28, maxWidth: 760 }}>

          {/* ── Notifications ── */}
          <SectionCard title="Notifications" icon={Bell}>
            <SettingRow label="Email Notifications" desc="Receive weekly summaries and alerts via email">
              <Toggle value={settings.emailNotifs} onChange={v => update("emailNotifs", v)} />
            </SettingRow>
            <SettingRow label="Push Notifications" desc="Browser push alerts for budget warnings">
              <Toggle value={settings.pushNotifs} onChange={v => update("pushNotifs", v)} />
            </SettingRow>
            <SettingRow label="Budget Alerts" desc="Notify when spending approaches category limits">
              <Toggle value={settings.budgetAlerts} onChange={v => update("budgetAlerts", v)} />
            </SettingRow>
            <SettingRow label="Weekly Report" desc="Summary of your week every Sunday">
              <Toggle value={settings.weeklyReport} onChange={v => update("weeklyReport", v)} />
            </SettingRow>
            <SettingRow label="Monthly Report" desc="Full breakdown at end of every month">
              <Toggle value={settings.monthlyReport} onChange={v => update("monthlyReport", v)} />
            </SettingRow>
          </SectionCard>

          {/* ── Appearance ── */}
          <SectionCard title="Appearance" icon={Moon}>
            <SettingRow label="Dark Mode" desc="Use dark theme across the app">
              <Toggle value={settings.darkMode} onChange={v => update("darkMode", v)} />
            </SettingRow>
            <SettingRow label="Compact View" desc="Show more data with reduced spacing">
              <Toggle value={settings.compactView} onChange={v => update("compactView", v)} />
            </SettingRow>
          </SectionCard>

          {/* ── Preferences ── */}
          <SectionCard title="Preferences" icon={Globe}>
            <SettingRow label="Currency" desc="Default currency for all transactions">
              <select style={selectStyle} value={settings.currency} onChange={e => update("currency", e.target.value)}>
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </SettingRow>
            <SettingRow label="Language" desc="Display language for the app">
              <select style={selectStyle} value={settings.language} onChange={e => update("language", e.target.value)}>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
              </select>
            </SettingRow>
            <SettingRow label="Date Format" desc="How dates are displayed throughout the app">
              <select style={selectStyle} value={settings.dateFormat} onChange={e => update("dateFormat", e.target.value)}>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </SettingRow>
          </SectionCard>

          {/* ── Privacy ── */}
          <SectionCard title="Privacy & Security" icon={Shield}>
            <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
              <Toggle value={settings.twoFactor} onChange={v => update("twoFactor", v)} />
            </SettingRow>
            <SettingRow label="Anonymous Data Sharing" desc="Help improve SpendWise by sharing anonymized usage data">
              <Toggle value={settings.dataSharing} onChange={v => update("dataSharing", v)} />
            </SettingRow>
            <SettingRow label="Connected Accounts" desc="Manage linked Google or bank accounts">
              <button style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "#a78bfa", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Manage <ChevronRight size={13} />
              </button>
            </SettingRow>
          </SectionCard>

          {/* ── Danger zone ── */}
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f87171", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <Trash2 size={16} /> Danger Zone
            </div>
            <div style={{ borderTop: "1px solid rgba(239,68,68,0.1)", marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(239,68,68,0.08)" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#d1d5db" }}>Export All Data</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Download all your transactions and reports as a ZIP file</div>
                </div>
                <button style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Export
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f87171" }}>Delete Account</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Permanently delete your account and all associated data</div>
                </div>
                <button onClick={() => setShowDeleteModal(true)} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(239,68,68,0.7)", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.9)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.7)"}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Delete confirm modal ── */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d0b1f", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400, animation: "modalPop 0.25s ease", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Trash2 size={24} color="#f87171" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Delete Account?</h3>
            <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>This will permanently delete all your data including transactions, budgets, and reports. This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#d1d5db", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button style={{ flex: 1, padding: "11px", background: "rgba(239,68,68,0.85)", border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
