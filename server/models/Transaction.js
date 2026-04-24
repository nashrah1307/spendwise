import mongoose from "mongoose"

const TransactionSchema = new mongoose.Schema({
  // Which user does this transaction belong to?
  user: {
    type: mongoose.Schema.Types.ObjectId, // references the User model
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  type: {
    type: String,
    enum: ["income", "expense"], // only these two values allowed
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  mode: {
    type: String,
    enum: ["UPI", "Card", "Cash", "Bank Transfer"],
    default: "UPI",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: "",
    trim: true,
  },
}, {
  timestamps: true,
})

// ── Index for faster queries ───────────────────────────────────────────────
// When we filter by user + date, MongoDB finds results faster
TransactionSchema.index({ user: 1, date: -1 })

const Transaction = mongoose.model("Transaction", TransactionSchema)
export default Transaction
