import { useNavigate, useLocation } from "react-router-dom"
import {
  TrendingUp, LayoutDashboard, Wallet, Target, FileText,
  Settings, LogOut, ChevronRight
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Wallet, label: "Transactions", path: "/transactions" },
  { icon: Target, label: "Budget", path: "/budget" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const handleLogout = () => {
  localStorage.removeItem("spendwise_user")
  localStorage.removeItem("spendwise_auth")
  navigate("/")
}
  const location = useLocation()

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, height: "100vh", width: 240,
      background: "#0d0b1f", borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex", flexDirection: "column", zIndex: 50,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>SpendWise</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, padding: "0 8px", marginBottom: 8, letterSpacing: "0.08em" }}>MENU</div>
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path
          return (
            <div key={label} onClick={() => navigate(path)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 12px", borderRadius: 10, marginBottom: 4,
              background: active ? "rgba(124,58,237,0.18)" : "transparent",
              border: active ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
              color: active ? "#a78bfa" : "#6b7280",
              cursor: "pointer", transition: "all 0.2s", fontSize: 14, fontWeight: active ? 600 : 500,
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#d1d5db" } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280" } }}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </div>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div onClick={() => navigate("/profile")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>AR</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Aisha Rahman</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Free Plan</div>
          </div>
        </div>
        <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, color: "#6b7280", cursor: "pointer", fontSize: 14, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent" }}>
          <LogOut size={16} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}
