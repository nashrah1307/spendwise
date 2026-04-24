import Budget from "../models/Budget.js"
import Transaction from "../models/Transaction.js"

// ── @route   GET /api/budgets ─────────────────────────────────────────────
// ── @access  Protected
export const getBudgets = async (req, res) => {
  try {
    const { month } = req.query // e.g. "2026-03"

    let filter = { user: req.user._id }
    if (month) filter.month = month

    const budgets = await Budget.find(filter).sort({ category: 1 })
    res.json(budgets)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   POST /api/budgets ────────────────────────────────────────────
// ── @access  Protected
export const createBudget = async (req, res) => {
  try {
    const { category, limit, month, color } = req.body

    if (!category || !limit || !month) {
      return res.status(400).json({ message: "Category, limit and month are required" })
    }

    // Check if budget already exists for this category + month
    const exists = await Budget.findOne({
      user: req.user._id,
      category,
      month,
    })

    if (exists) {
      return res.status(400).json({ message: `Budget for ${category} in ${month} already exists` })
    }

    // Auto-calculate spent from existing transactions this month
    const [year, m] = month.split("-")
    const start = new Date(year, m - 1, 1)
    const end   = new Date(year, m, 0, 23, 59, 59)

    const spentData = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          category,
          type: "expense",
          date: { $gte: start, $lte: end }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    const spent = spentData[0]?.total || 0

    const budget = await Budget.create({
      user: req.user._id,
      category, limit, month, color,
      spent, // auto-filled from transactions
    })

    res.status(201).json(budget)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   PUT /api/budgets/:id ─────────────────────────────────────────
// ── @access  Protected
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   DELETE /api/budgets/:id ──────────────────────────────────────
// ── @access  Protected
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" })
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await budget.deleteOne()
    res.json({ message: "Budget deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
