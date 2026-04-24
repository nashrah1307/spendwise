import { useState, useEffect } from "react"
import {
  TrendingUp, Target, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import Sidebar from "../../components/Sidebar"
import TopBar from "../../components/Topbar"
import { transactionAPI, budgetAPI } from "../../services/api"
import { LoadingSpinner, ErrorMessage } from "../../hooks/useApi"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"

// ── Category colors ────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Income: "#34d399", Food: "#f59e0b", Travel: "#06b6d4",
  Rent: "#a78bfa", Entertainment: "#ec4899", Shopping: "#7c3aed",
  Health: "#10b981", Utilities: "#6b7280", Others: "#9ca3af"
}

const COLOR_LIST = ["#a78bfa","#34d399","#f87171","#06b6d4","#fbbf24","#f472b6","#7c3aed","#10b981"]

// ── Month helpers ──────────────────────────────────────────────────────────
function getAvailableMonths(count = 6) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("default", { month: "long", year: "numeric" })
    months.push({ value, label })
  }
  return months
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "#13102a", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.name === "income" ? "#34d399" : "#f87171", marginBottom: 2 }}>
          {p.name === "income" ? "Income" : "Expense"}: ₹{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", justifyContent: "center", marginTop: 12 }}>
      {payload.map(({ value, color }) => (
        <div key={value} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Summary Card ───────────────────────────────────────────────────────────
function SummaryCard({ title, value, sub, trend, color, icon: Icon }) {
  const isPositive = trend >= 0
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "20px 22px", transition: "all 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.transform = "translateY(-2px)" }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>{title}</div>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {isPositive ? <ArrowUpRight size={14} color="#34d399" /> : <ArrowDownRight size={14} color="#f87171" />}
        <span style={{ fontSize: 12, color: isPositive ? "#34d399" : "#f87171", fontWeight: 600 }}>{Math.abs(trend)}%</span>
        <span style={{ fontSize: 12, color: "#6b7280" }}>{sub}</span>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const availableMonths = getAvailableMonths(6)
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0].value)

  const [summary, setSummary]               = useState({ income: 0, expense: 0, balance: 0, savingsRate: 0 })
  const [monthlyData, setMonthlyData]       = useState([])
  const [recentTransactions, setRecentTxns] = useState([])
  const [categoryData, setCategoryData]     = useState([])
  const [budgets, setBudgets]               = useState([])
  const [pageLoading, setPageLoading]       = useState(true)
  const [pageError, setPageError]           = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setPageLoading(true)
      setPageError(null)
      try {
        // ── Fetch summary + recent transactions + budgets in parallel ──
        const [summaryRes, txRes, budgetRes] = await Promise.all([
          transactionAPI.getSummary(selectedMonth),
          transactionAPI.getAll(),
          budgetAPI.getAll(selectedMonth),
        ])

        setSummary(summaryRes.data)
        setBudgets(budgetRes.data)

        // ── Recent 5 transactions ──
        const allTx = txRes.data
        setRecentTxns(allTx.slice(0, 5))

        // ── Build pie chart data from real expense transactions ──
        const expenseTx = allTx.filter(tx => {
          if (tx.type !== "expense") return false
          const txMonth = tx.date?.substring(0, 7)
          return txMonth === selectedMonth
        })

        // Group by category and sum amounts
        const categoryMap = {}
        expenseTx.forEach(tx => {
          categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
        })
        const pieData = Object.entries(categoryMap).map(([name, value], i) => ({
          name,
          value,
          color: CATEGORY_COLORS[name] || COLOR_LIST[i % COLOR_LIST.length]
        }))
        setCategoryData(pieData)

        // ── Build monthly trend for last 6 months ──
        const [selYear, selMonthNum] = selectedMonth.split("-").map(Number)
        const months = []
        for (let i = 5; i >= 0; i--) {
          const d = new Date(selYear, selMonthNum - 1 - i, 1)
          const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          const label = d.toLocaleString("default", { month: "short" })
          const res = await transactionAPI.getSummary(monthStr)
          months.push({ month: label, income: res.data.income, expense: res.data.expense })
        }
        setMonthlyData(months)

      } catch (err) {
        setPageError(err.response?.data?.message || "Failed to load dashboard")
      } finally {
        setPageLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedMonth])

  const summaryCards = [
    { title: "Total Balance",  value: `₹${(summary.balance ?? 0).toLocaleString()}`,    sub: "vs last month", trend: 12, color: "#34d399", icon: TrendingUp },
    { title: "Total Income",   value: `₹${(summary.income ?? 0).toLocaleString()}`,     sub: "vs last month", trend: 0,  color: "#06b6d4", icon: ArrowUpRight },
    { title: "Total Expenses", value: `₹${(summary.expense ?? 0).toLocaleString()}`,    sub: "vs last month", trend: -8, color: "#f87171", icon: ArrowDownRight },
    { title: "Savings Rate",   value: `${summary.savingsRate ?? 0}%`,                   sub: "vs last month", trend: 5,  color: "#a78bfa", icon: Target },
  ]

  const selectedMonthLabel = availableMonths.find(m => m.value === selectedMonth)?.label ?? ""

  if (pageLoading) return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </main>
    </div>
  )

  if (pageError) return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorMessage message={pageError} onRetry={() => window.location.reload()} />
      </main>
    </div>
  )

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .dash-animate   { animation: fadeUp 0.5s ease forwards; }
        .dash-animate-2 { animation: fadeUp 0.5s ease 0.1s forwards; opacity: 0; }
        .dash-animate-3 { animation: fadeUp 0.5s ease 0.2s forwards; opacity: 0; }
        .recharts-tooltip-cursor { fill: rgba(124,58,237,0.08) !important; }
      `}</style>

      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
        <TopBar title="Dashboard" subtitle="Welcome back">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#d1d5db", padding: "7px 12px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {availableMonths.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </TopBar>

        <div style={{ padding: 28 }}>

          {/* ── Summary Cards ── */}
          <div className="dash-animate" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
            {summaryCards.map(card => <SummaryCard key={card.title} {...card} />)}
          </div>

          {/* ── Charts Row ── */}
          <div className="dash-animate-2" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>

            {/* Bar chart */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Monthly Overview</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Income vs Expenses — last 6 months</div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[["#34d399", "Income"], ["#f87171", "Expense"]].map(([color, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} barSize={12} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                  <Bar dataKey="income"  fill="#34d399" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart — real category data */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Expense Breakdown</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>By category — {selectedMonthLabel}</div>
              {categoryData.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "#4b5563", fontSize: 13 }}>
                  No expense data for this month
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="45%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                    </Pie>
                    <Tooltip formatter={v => [`₹${v.toLocaleString()}`, ""]} contentStyle={{ background: "#13102a", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, fontSize: 13 }} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Recent Transactions + Budget ── */}
          <div className="dash-animate-3" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>

            {/* Recent Transactions */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Recent Transactions</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Your last 5 activities</div>
                </div>
                <button style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#a78bfa", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  View All
                </button>
              </div>
              {recentTransactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#4b5563", fontSize: 13 }}>
                  No transactions yet. Add your first one!
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Date", "Description", "Category", "Mode", "Amount"].map(h => (
                          <th key={h} style={{ textAlign: "left", fontSize: 11, color: "#4b5563", fontWeight: 600, padding: "0 12px 12px 0", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx, i) => (
                        <tr key={tx._id ?? i}
                          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "12px 12px 12px 0", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
                            {tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                          </td>
                          {/* FIX: use tx.name — matches Transaction model field */}
                          <td style={{ padding: "12px 12px 12px 0", fontSize: 13, color: "#fff", fontWeight: 500 }}>{tx.name ?? "—"}</td>
                          <td style={{ padding: "12px 12px 12px 0" }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: tx.type === "income" ? "rgba(52,211,153,0.12)" : "rgba(124,58,237,0.12)", color: tx.type === "income" ? "#34d399" : "#a78bfa", border: `1px solid ${tx.type === "income" ? "rgba(52,211,153,0.25)" : "rgba(124,58,237,0.25)"}`, whiteSpace: "nowrap" }}>
                              {tx.category ?? "—"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 12px 12px 0", fontSize: 12, color: "#6b7280" }}>{tx.mode ?? "—"}</td>
                          <td style={{ padding: "12px 0", fontSize: 14, fontWeight: 700, color: tx.type === "income" ? "#34d399" : "#f87171", whiteSpace: "nowrap" }}>
                            {tx.type === "income" ? "+" : "−"}₹{Math.abs(tx.amount ?? 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Budget Overview — real data */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Budget Overview</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedMonthLabel}</div>
                </div>
                <button style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8, color: "#a78bfa", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Manage
                </button>
              </div>
              {budgets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#4b5563", fontSize: 13 }}>
                  No budgets set for this month
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {budgets.map(b => {
                    const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100)
                    const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : b.color || "#7c3aed"
                    return (
                      <div key={b._id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: barColor }} />
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#d1d5db" }}>{b.category}</span>
                            {pct >= 90 && (
                              <span style={{ fontSize: 10, background: "rgba(239,68,68,0.15)", color: "#f87171", padding: "1px 7px", borderRadius: 100, border: "1px solid rgba(239,68,68,0.25)" }}>⚠ Near limit</span>
                            )}
                          </div>
                          <span style={{ fontSize: 12, color: "#6b7280" }}>₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 100, transition: "width 1s ease" }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4, textAlign: "right" }}>{pct}% used</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
