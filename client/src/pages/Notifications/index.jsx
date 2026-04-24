import { useState } from "react"
// import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Bell, AlertTriangle, CheckCircle, TrendingUp,
  Target, FileText, Trash2, CheckCheck
} from "lucide-react"

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "warning", icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", title: "Travel budget almost full", desc: "You've used 95% of your ₹4,000 travel budget this month.", time: "2 hours ago", read: false },
  { id: 2, type: "success", icon: CheckCircle, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", title: "Salary credited", desc: "₹80,000 has been added as income for March 2026.", time: "1 day ago", read: false },
  { id: 3, type: "info", icon: TrendingUp, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", title: "Savings up this month!", desc: "Your savings rate increased by 5% compared to February.", time: "2 days ago", read: false },
  { id: 4, type: "warning", icon: AlertTriangle, color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", title: "Rent budget exceeded", desc: "You've spent ₹15,000 on rent, which matches your budget limit.", time: "3 days ago", read: true },
  { id: 5, type: "info", icon: Target, color: "#06b6d4", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)", title: "New budget tip", desc: "Try reducing dining expenses by 10% to boost your savings.", time: "4 days ago", read: true },
  { id: 6, type: "success", icon: FileText, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", title: "February report ready", desc: "Your monthly report for February 2026 is now available.", time: "5 days ago", read: true },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "read") return n.read
    return true
  })

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const deleteOne = (id) => setNotifications(ns => ns.filter(n => n.id !== id))
  const clearAll = () => setNotifications([])

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .page-animate { animation: fadeUp 0.5s ease; }
        .notif-row:hover { background: rgba(255,255,255,0.03) !important; }
      `}</style>

      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <Topbar title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"} />

        <div className="page-animate" style={{ padding: 28, maxWidth: 800 }}>

          {/* ── Actions bar ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            {/* Filter tabs */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, gap: 2 }}>
              {["all", "unread", "read"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                  background: filter === f ? "rgba(124,58,237,0.25)" : "transparent",
                  color: filter === f ? "#a78bfa" : "#6b7280",
                  borderColor: filter === f ? "rgba(124,58,237,0.35)" : "transparent",
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === "unread" && unreadCount > 0 && (
                    <span style={{ marginLeft: 6, background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 100 }}>{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 9, color: "#a78bfa", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.22)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 9, color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                  <Trash2 size={14} /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* ── Notifications list ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
              <Bell size={40} style={{ margin: "0 auto 14px", opacity: 0.25, display: "block" }} color="#a78bfa" />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No notifications</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>You're all caught up!</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(n => {
                const Icon = n.icon
                return (
                  <div key={n.id} className="notif-row" onClick={() => markRead(n.id)} style={{
                    display: "flex", gap: 14, padding: "16px 18px", borderRadius: 13,
                    background: n.read ? "rgba(255,255,255,0.02)" : "rgba(124,58,237,0.06)",
                    border: `1px solid ${n.read ? "rgba(255,255,255,0.07)" : "rgba(124,58,237,0.18)"}`,
                    cursor: "pointer", transition: "all 0.2s", position: "relative"
                  }}>
                    {/* Icon */}
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: n.bg, border: `1px solid ${n.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={n.color} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, color: n.read ? "#d1d5db" : "#fff" }}>{n.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: "#4b5563", whiteSpace: "nowrap" }}>{n.time}</span>
                          <button onClick={e => { e.stopPropagation(); deleteOne(n.id) }} style={{ width: 24, height: 24, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#f87171", transition: "all 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 3, lineHeight: 1.5 }}>{n.desc}</div>
                    </div>

                    {/* Unread dot */}
                    {!n.read && <div style={{ position: "absolute", top: 18, right: 56, width: 7, height: 7, background: "#7c3aed", borderRadius: "50%" }} />}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
