import { useNavigate } from "react-router-dom"
import { Bell } from "lucide-react"

export default function TopBar({ title, subtitle, children }) {
  const navigate = useNavigate()

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "rgba(8,8,15,0.9)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      padding: "0 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 64,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Left: title */}
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{subtitle}</p>}
      </div>

      {/* Center: any extra controls passed in */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {children}

        {/* Notification bell */}
        <div onClick={() => navigate("/notifications")} style={{ position: "relative", width: 38, height: 38, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
          <Bell size={16} color="#9ca3af" />
          <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#7c3aed", borderRadius: "50%", border: "1.5px solid #08080f" }} />
        </div>

        {/* Avatar → profile */}
        <div onClick={() => navigate("/profile")} style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff", cursor: "pointer", transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          AR
        </div>
      </div>
    </div>
  )
}
