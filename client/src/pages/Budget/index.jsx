import { useEffect, useState } from "react";
import {
  TrendingUp,
  LayoutDashboard,
  Wallet,
  Target,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { budgetAPI } from "../../services/api";
import { LoadingSpinner, ErrorMessage } from "../../hooks/useApi";

const CATEGORIES = [
  "Food",
  "Rent",
  "Travel",
  "Entertainment",
  "Shopping",
  "Health",
  "Utilities",
  "Education",
  "Others",
];
const CATEGORY_COLORS = {
  Food: "#f59e0b",
  Rent: "#a78bfa",
  Travel: "#06b6d4",
  Entertainment: "#ec4899",
  Shopping: "#7c3aed",
  Health: "#10b981",
  Utilities: "#6b7280",
  Education: "#34d399",
  Others: "#9ca3af",
};

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

// const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
//   { icon: Wallet, label: "Transactions", path: "/transactions" },
//   { icon: Target, label: "Budget", path: "/budget", active: true },
//   { icon: FileText, label: "Reports", path: "/reports" },
//   { icon: Settings, label: "Settings", path: "/settings" },
// ];

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#13102a",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 6 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: p.name === "Budgeted" ? "#a78bfa" : "#34d399",
            marginBottom: 2,
          }}
        >
          {p.name}: ₹{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

// ── Budget Card ────────────────────────────────────────────────────────────
function BudgetCard({ budget, onDelete }) {
  const pct = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
  const isOver = budget.spent >= budget.limit;
  const isNear = pct >= 80 && !isOver;
  const barColor = isOver ? "#ef4444" : isNear ? "#f59e0b" : budget.color;
  const remaining = budget.limit - budget.spent;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${isOver ? "rgba(239,68,68,0.25)" : isNear ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 14,
        padding: "20px 22px",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: `${budget.color}18`,
              border: `1px solid ${budget.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: budget.color,
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {budget.category}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
              Monthly budget
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isOver && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 100,
                background: "rgba(239,68,68,0.15)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              ⚠ Over
            </span>
          )}
          {isNear && !isOver && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 100,
                background: "rgba(245,158,11,0.15)",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              Near limit
            </span>
          )}
          <button
            onClick={() => onDelete(budget._id)}
            style={{
              width: 28,
              height: 28,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#f87171",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
            }
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Amounts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
            Spent
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: isOver ? "#f87171" : "#fff",
            }}
          >
            ₹{budget.spent.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
            Budget
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#9ca3af" }}>
            ₹{budget.limit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 7,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 100,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: barColor,
            borderRadius: 100,
            transition: "width 1s ease",
          }}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: barColor, fontWeight: 600 }}>
          {pct}% used
        </span>
        <span style={{ fontSize: 12, color: isOver ? "#f87171" : "#6b7280" }}>
          {isOver
            ? `₹${(budget.spent - budget.limit).toLocaleString()} over`
            : `₹${remaining.toLocaleString()} left`}
        </span>
      </div>
    </div>
  );
}

// ── Main Budget Page ───────────────────────────────────────────────────────
export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(getAvailableMonths()[0].value);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "Food", limit: "", spent: "" });
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const totalBudgeted = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const fetchBudgets = async () => {
  setPageLoading(true)
  setPageError(null)
  try {
    const res = await budgetAPI.getAll(month)   // ← use month directly
      setBudgets(res.data);
    } catch (err) {
      setPageError(err.response?.data?.message || "Failed to load budgets");
    } finally {
      setPageLoading(false);
    }
  };

  const chartData = budgets.map((b) => ({
    name: b.category,
    Budgeted: b.limit,
    Spent: b.spent,
  }));

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.limit || isNaN(form.limit) || Number(form.limit) <= 0)
      e.limit = "Enter a valid budget amount";
    if (form.spent !== "" && (isNaN(form.spent) || Number(form.spent) < 0))
      e.spent = "Enter a valid spent amount";
    if (budgets.find((b) => b.category === form.category))
      e.category = "Budget for this category already exists";
    return e;
  };

  const handleAdd = async () => {
  const e = validate()
  if (Object.keys(e).length) { setErrors(e); return }

  try {
    const res = await budgetAPI.create({
      category: form.category,
      limit: Number(form.limit),
      spent: Number(form.spent) || 0,
      month: month,   // ← use month directly
        color: CATEGORY_COLORS[form.category] || "#9ca3af",
      });
      setBudgets((bs) => [...bs, res.data]);
      setForm({ category: "Food", limit: "", spent: "" });
      setErrors({});
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create budget";
      setErrors({ category: message });
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetAPI.delete(id);
      setBudgets((bs) => bs.filter((b) => b._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete budget");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9,
    padding: "10px 13px",
    color: "#fff",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "all 0.2s",
  };
  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#d1d5db",
    display: "block",
    marginBottom: 5,
  };

  if (pageLoading)
    return (
      <div
        style={{ background: "#08080f", minHeight: "100vh", display: "flex" }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: 240,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingSpinner />
        </main>
      </div>
    );

  if (pageError)
    return (
      <div
        style={{ background: "#08080f", minHeight: "100vh", display: "flex" }}
      >
        <Sidebar />
        <main
          style={{
            marginLeft: 240,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ErrorMessage message={pageError} onRetry={fetchBudgets} />
        </main>
      </div>
    );

  return (
    <div
      style={{
        background: "#08080f",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        color: "#fff",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalPop { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .page-animate { animation: fadeUp 0.5s ease; }
        .form-animate { animation: slideDown 0.3s ease; }
        .budget-input:focus { border-color: rgba(124,58,237,0.6) !important; background: rgba(124,58,237,0.08) !important; outline: none; }
        select option { background: #13102a; color: #fff; }
        .recharts-tooltip-cursor { fill: rgba(124,58,237,0.06) !important; }
      `}</style>

      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {/* Top bar */}
        <Topbar
          title="Budget Planner"
          subtitle={`${budgets.length} categories tracked`}
        >
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#d1d5db",
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {getAvailableMonths().map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Topbar>

        <div className="page-animate" style={{ padding: 28 }}>
          {/* ── Summary Banner ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "Total Budgeted",
                value: `₹${totalBudgeted.toLocaleString()}`,
                color: "#a78bfa",
                bg: "rgba(167,139,250,0.1)",
                border: "rgba(167,139,250,0.2)",
              },
              {
                label: "Total Spent",
                value: `₹${totalSpent.toLocaleString()}`,
                color: "#f87171",
                bg: "rgba(248,113,113,0.1)",
                border: "rgba(248,113,113,0.2)",
              },
              {
                label: "Remaining",
                value: `₹${Math.max(totalRemaining, 0).toLocaleString()}`,
                color: "#34d399",
                bg: "rgba(52,211,153,0.1)",
                border: "rgba(52,211,153,0.2)",
              },
            ].map(({ label, value, color, bg, border }) => (
              <div
                key={label}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 13,
                  padding: "20px 22px",
                }}
              >
                <div
                  style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color }}>
                  {value}
                </div>
                <div
                  style={{
                    height: 3,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 100,
                    marginTop: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width:
                        label === "Total Spent"
                          ? `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%`
                          : label === "Remaining"
                            ? `${Math.max((totalRemaining / totalBudgeted) * 100, 0)}%`
                            : "100%",
                      background: color,
                      borderRadius: 100,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ── Bar Chart ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "22px 20px",
              marginBottom: 24,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                Budget vs Actual Spending
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Compare your budget limits against actual spend per category
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={14} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(124,58,237,0.06)" }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#9ca3af",
                    paddingTop: 12,
                  }}
                />
                <Bar
                  dataKey="Budgeted"
                  fill="rgba(167,139,250,0.7)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="Spent" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Add Budget Form (inline) ── */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: showForm ? 16 : 0,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  Category Budgets
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  Set and manage monthly limits per category
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setErrors({});
                }}
                style={{
                  background: showForm
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "#fff",
                  border: showForm ? "1px solid rgba(255,255,255,0.1)" : "none",
                  borderRadius: 9,
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: showForm
                    ? "none"
                    : "0 4px 14px rgba(124,58,237,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {showForm ? (
                  <>
                    <X size={14} /> Cancel
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Set New Budget
                  </>
                )}
              </button>
            </div>

            {/* Inline form */}
            {showForm && (
              <div
                className="form-animate"
                style={{
                  background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 14,
                  padding: "20px 22px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: "#a78bfa",
                  }}
                >
                  New Category Budget
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 14,
                    alignItems: "end",
                  }}
                >
                  {/* Category */}
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      className="budget-input"
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      style={{
                        ...inputStyle,
                        cursor: "pointer",
                        borderColor: errors.category
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <div
                        style={{ color: "#ef4444", fontSize: 11, marginTop: 3 }}
                      >
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Budget limit */}
                  <div>
                    <label style={labelStyle}>Budget Limit (₹)</label>
                    <input
                      className="budget-input"
                      type="number"
                      placeholder="e.g. 5000"
                      value={form.limit}
                      onChange={(e) => update("limit", e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.limit
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                    {errors.limit && (
                      <div
                        style={{ color: "#ef4444", fontSize: 11, marginTop: 3 }}
                      >
                        {errors.limit}
                      </div>
                    )}
                  </div>

                  {/* Already spent */}
                  <div>
                    <label style={labelStyle}>
                      Already Spent (₹){" "}
                      <span style={{ color: "#4b5563", fontWeight: 400 }}>
                        optional
                      </span>
                    </label>
                    <input
                      className="budget-input"
                      type="number"
                      placeholder="0"
                      value={form.spent}
                      onChange={(e) => update("spent", e.target.value)}
                      style={{
                        ...inputStyle,
                        borderColor: errors.spent
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                    {errors.spent && (
                      <div
                        style={{ color: "#ef4444", fontSize: 11, marginTop: 3 }}
                      >
                        {errors.spent}
                      </div>
                    )}
                  </div>

                  {/* Save button */}
                  <div>
                    <button
                      onClick={handleAdd}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 9,
                        padding: "10px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-1px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <Check size={14} /> Add Budget
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Budget Cards Grid ── */}
          {budgets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
              }}
            >
              <Target
                size={40}
                style={{
                  margin: "0 auto 14px",
                  opacity: 0.3,
                  display: "block",
                }}
                color="#a78bfa"
              />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                No budgets set yet
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
                Click "Set New Budget" to get started
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  padding: "10px 22px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Set New Budget
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {budgets.map((b) => (
                <BudgetCard
                  key={b._id}
                  budget={b}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#0d0b1f",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 28,
              width: "100%",
              maxWidth: 380,
              animation: "modalPop 0.25s ease",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <Trash2 size={22} color="#f87171" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
              Remove Budget?
            </h3>
            <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>
              This will remove the budget limit for this category.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 9,
                  color: "#d1d5db",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "rgba(239,68,68,0.85)",
                  border: "none",
                  borderRadius: 9,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
