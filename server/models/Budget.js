import mongoose from "mongoose"

const BudgetSchema = new mongoose.Schema({
  // Which user does this budget belong to?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  limit: {
    type: Number,
    required: [true, "Budget limit is required"],
    min: [1, "Budget limit must be greater than 0"],
  },
  spent: {
    type: Number,
    default: 0,
    min: 0,
  },
  month: {
    type: String, // stored as "2026-03" (YYYY-MM format)
    required: true,
  },
  color: {
    type: String,
    default: "#7c3aed",
  },
}, {
  timestamps: true,
})

// ── Compound index ─────────────────────────────────────────────────────────
// One budget per category per month per user
// This prevents duplicates like two "Food" budgets for March
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true })

const Budget = mongoose.model("Budget", BudgetSchema)
export default Budget
