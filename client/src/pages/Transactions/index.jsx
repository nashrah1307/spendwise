import { useEffect, useState, useMemo } from "react"
import {
  Search, Plus, Pencil, Trash2, X, Check, Filter
} from "lucide-react"
import Sidebar from "../../components/Sidebar"
import TopBar from "../../components/Topbar"
import { transactionAPI } from "../../services/api"
import { LoadingSpinner, ErrorMessage } from "../../hooks/useApi"

const CATEGORIES = ["Food", "Travel", "Rent", "Entertainment", "Shopping", "Health", "Utilities", "Income", "Others"]
const MODES = ["UPI", "Card", "Cash", "Bank Transfer"]
const CATEGORY_COLORS = {
  Income: "#34d399", Food: "#f59e0b", Travel: "#06b6d4",
  Rent: "#a78bfa", Entertainment: "#ec4899", Shopping: "#7c3aed",
  Health: "#10b981", Utilities: "#6b7280", Others: "#9ca3af"
}
const ITEMS_PER_PAGE = 8

const labelStyle = { fontSize: 13, fontWeight: 600, color: "#d1d5db", display: "block", marginBottom: 6 }
const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }
const selectStyle = { ...inputStyle, cursor: "pointer" }
const errStyle = { color: "#ef4444", fontSize: 12, marginTop: 4 }

// ── Transaction Modal ──────────────────────────────────────────────────────
// FIX: Removed pageLoading/pageError from inside this component — they don't exist here
function TransactionModal({ tx, onClose, onSave }) {
  const isEdit = !!tx?._id
  const [form, setForm] = useState({
    type: tx?.type || "expense",
    name: tx?.name || "",
    amount: tx?.amount || "",
    category: tx?.category || "Food",
    mode: tx?.mode || "UPI",
    date: tx?.date ? new Date(tx.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState({})

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Description is required"
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter a valid amount"
    if (!form.date) e.date = "Date is required"
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    // FIX: pass _id so parent handleSave knows it's an edit
    onSave({ ...form, amount: Number(form.amount), _id: tx?._id || null })
    onClose()
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 28, width: "100%", maxWidth: 460, animation: "modalPop 0.25s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{isEdit ? "Edit Transaction" : "Add Transaction"}</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9ca3af" }}><X size={16} /></button>
        </div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {["expense", "income"].map(t => (
            <button key={t} onClick={() => update("type", t)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: form.type === t ? `1px solid ${t === "income" ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}` : "1px solid transparent", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", background: form.type === t ? (t === "income" ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)") : "transparent", color: form.type === t ? (t === "income" ? "#34d399" : "#f87171") : "#6b7280" }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Description</label>
            <input className="modal-input" placeholder="e.g. Zomato Order" value={form.name} onChange={e => update("name", e.target.value)} style={{ ...inputStyle, borderColor: errors.name ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }} />
            {errors.name && <div style={errStyle}>{errors.name}</div>}
          </div>
          <div>
            <label style={labelStyle}>Amount (₹)</label>
            <input className="modal-input" type="number" placeholder="0.00" value={form.amount} onChange={e => update("amount", e.target.value)} style={{ ...inputStyle, borderColor: errors.amount ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }} />
            {errors.amount && <div style={errStyle}>{errors.amount}</div>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} style={selectStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Payment Mode</label>
              <select value={form.mode} onChange={e => update("mode", e.target.value)} style={selectStyle}>
                {MODES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={e => update("date", e.target.value)} style={{ ...inputStyle, borderColor: errors.date ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)", colorScheme: "dark" }} />
            {errors.date && <div style={errStyle}>{errors.date}</div>}
          </div>
          <button onClick={handleSave} style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, boxShadow: "0 4px 20px rgba(124,58,237,0.35)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.35)" }}>
            <Check size={16} /> {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Transactions Page ─────────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [pageLoading, setPageLoading]   = useState(true)
  const [pageError, setPageError]       = useState(null)
  const [search, setSearch]             = useState("")
  const [typeFilter, setTypeFilter]     = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateFrom, setDateFrom]         = useState("")
  const [dateTo, setDateTo]             = useState("")
  const [page, setPage]                 = useState(1)
  const [modal, setModal]               = useState(null)
  const [deleteId, setDeleteId]         = useState(null)

  useEffect(() => { fetchTransactions() }, [])

  const fetchTransactions = async () => {
    setPageLoading(true)
    setPageError(null)
    try {
      const res = await transactionAPI.getAll()
      setTransactions(res.data)
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to load transactions")
    } finally {
      setPageLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === "all" || tx.type === typeFilter
      const matchCat = categoryFilter === "all" || tx.category === categoryFilter
      const txDate = tx.date?.split("T")[0] || ""
      const matchFrom = !dateFrom || txDate >= dateFrom
      const matchTo = !dateTo || txDate <= dateTo
      return matchSearch && matchType && matchCat && matchFrom && matchTo
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, search, typeFilter, categoryFilter, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleSave = async (tx) => {
    try {
      if (tx._id) {
        const res = await transactionAPI.update(tx._id, tx)
        setTransactions(ts => ts.map(t => t._id === tx._id ? res.data : t))
      } else {
        const res = await transactionAPI.create(tx)
        setTransactions(ts => [res.data, ...ts])
      }
      setPage(1)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save transaction")
    }
  }

  const handleDelete = async (id) => {
    try {
      await transactionAPI.delete(id)
      setTransactions(ts => ts.filter(t => t._id !== id))
      setDeleteId(null)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete transaction")
    }
  }

  const clearFilters = () => { setSearch(""); setTypeFilter("all"); setCategoryFilter("all"); setDateFrom(""); setDateTo(""); setPage(1) }
  const hasFilters = search || typeFilter !== "all" || categoryFilter !== "all" || dateFrom || dateTo
  const totalIncome  = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

  // FIX: loading/error states are here in the MAIN component, not inside TransactionModal
  if (pageLoading) return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <Sidebar />
      <main className="main-content" style={{ marginLeft: 240, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </main>
    </div>
  )

  if (pageError) return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <Sidebar />
      <main className="main-content" style={{ marginLeft: 240, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ErrorMessage message={pageError} onRetry={fetchTransactions} />
      </main>
    </div>
  )

  return (
    <div style={{ background: "#08080f", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#fff", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .page-animate { animation: fadeUp 0.5s ease; }
        .modal-input:focus { border-color: rgba(124,58,237,0.6) !important; background: rgba(124,58,237,0.08) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.12); outline: none; }
        .filter-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; color: #fff; font-size: 13px; font-family: 'DM Sans', sans-serif; padding: 9px 12px; transition: all 0.2s; outline: none; }
        .filter-input:focus { border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.08); }
        .row-hover:hover { background: rgba(255,255,255,0.03) !important; }
        select option { background: #13102a; color: #fff; }
        @media (max-width: 768px) { .main-content { margin-left: 0 !important; } }
      `}</style>

      <Sidebar />

      <main className="main-content" style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        <TopBar title="Transactions" subtitle={`${filtered.length} transactions found`} />

        <div className="page-animate" style={{ padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Income",   value: `₹${totalIncome.toLocaleString()}`,                 color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)" },
              { label: "Total Expenses", value: `₹${totalExpense.toLocaleString()}`,                color: "#f87171", bg: "rgba(248,113,113,0.1)",  border: "rgba(248,113,113,0.2)" },
              { label: "Net Balance",    value: `₹${(totalIncome - totalExpense).toLocaleString()}`, color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 180px", minWidth: 180 }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
                <input className="filter-input" placeholder="Search transactions..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ width: "100%", paddingLeft: 34 }} />
              </div>
              <select className="filter-input" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select className="filter-input" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="date" className="filter-input" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} style={{ colorScheme: "dark" }} />
              <span style={{ color: "#4b5563", fontSize: 13 }}>to</span>
              <input type="date" className="filter-input" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} style={{ colorScheme: "dark" }} />
              {hasFilters && (
                <button onClick={clearFilters} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                  <X size={13} /> Clear
                </button>
              )}
              <button onClick={() => setModal("add")} style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(124,58,237,0.35)", transition: "all 0.2s", marginLeft: "auto" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <Plus size={15} /> Add Transaction
              </button>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Date", "Description", "Category", "Payment Mode", "Amount", "Actions"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontSize: 11, color: "#4b5563", fontWeight: 600, padding: "14px 16px", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "48px 16px", color: "#6b7280" }}>
                        <Filter size={32} style={{ margin: "0 auto 12px", opacity: 0.4, display: "block" }} />
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No transactions found</div>
                        <div style={{ fontSize: 13 }}>Try adjusting your filters or add a new transaction</div>
                      </td>
                    </tr>
                  ) : paginated.map(tx => (
                    <tr key={tx._id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 14, color: "#fff", fontWeight: 500 }}>{tx.name}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${CATEGORY_COLORS[tx.category] || "#6b7280"}18`, color: CATEGORY_COLORS[tx.category] || "#9ca3af", border: `1px solid ${CATEGORY_COLORS[tx.category] || "#6b7280"}30`, whiteSpace: "nowrap" }}>{tx.category}</span>
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "#6b7280" }}>{tx.mode}</td>
                      <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 700, color: tx.type === "income" ? "#34d399" : "#f87171", whiteSpace: "nowrap" }}>
                        {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: "13px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setModal(tx)} style={{ width: 30, height: 30, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", color: "#a78bfa" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.25)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(124,58,237,0.12)"}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(tx._id)} style={{ width: 30, height: 30, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", color: "#f87171" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.22)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: page === 1 ? "#4b5563" : "#d1d5db", fontSize: 13, cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>Previous</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 7, border: p === page ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.1)", background: p === page ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", color: p === page ? "#a78bfa" : "#d1d5db", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: p === page ? 700 : 400 }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: page === totalPages ? "#4b5563" : "#d1d5db", fontSize: 13, cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>Next</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <TransactionModal
          tx={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 380, animation: "modalPop 0.25s ease", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Trash2 size={22} color="#f87171" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Transaction?</h3>
            <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "11px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#d1d5db", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "11px", background: "rgba(239,68,68,0.85)", border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
