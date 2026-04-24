import Transaction from "../models/Transaction.js"

// ── @route   GET /api/transactions ───────────────────────────────────────
// ── @access  Protected
export const getTransactions = async (req, res) => {
  try {
    // Extract filters from query params
    // e.g. /api/transactions?type=expense&category=Food&from=2026-03-01
    const { type, category, from, to, search } = req.query

    // Start with base filter — only get THIS user's transactions
    let filter = { user: req.user._id }

    // Apply optional filters
    if (type && type !== "all")         filter.type = type
    if (category && category !== "all") filter.category = category

    // Date range filter
    if (from || to) {
      filter.date = {}
      if (from) filter.date.$gte = new Date(from) // greater than or equal
      if (to)   filter.date.$lte = new Date(to)   // less than or equal
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" } // case insensitive search
    }

    // Fetch from DB, sorted by newest first
    const transactions = await Transaction.find(filter).sort({ date: -1 })

    res.json(transactions)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   POST /api/transactions ──────────────────────────────────────
// ── @access  Protected
export const createTransaction = async (req, res) => {
  try {
    const { name, amount, type, category, mode, date, note } = req.body

    if (!name || !amount || !type || !category) {
      return res.status(400).json({ message: "Please fill in all required fields" })
    }

    const transaction = await Transaction.create({
      user: req.user._id, // attach to logged in user
      name, amount, type, category, mode, date, note,
    })

    res.status(201).json(transaction)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   PUT /api/transactions/:id ───────────────────────────────────
// ── @access  Protected
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    // Make sure the transaction belongs to the logged in user
    // We convert ObjectId to string for comparison
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    )

    res.json(updated)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   DELETE /api/transactions/:id ────────────────────────────────
// ── @access  Protected
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    // Make sure user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" })
    }

    await transaction.deleteOne()
    res.json({ message: "Transaction deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── @route   GET /api/transactions/summary ───────────────────────────────
// ── @access  Protected
// Returns total income, expense, balance for dashboard cards
export const getSummary = async (req, res) => {
  try {
    const { month } = req.query // e.g. "2026-03"

    let filter = { user: req.user._id }

    // Filter by month if provided
    if (month) {
      const [year, m] = month.split("-")
      const start = new Date(year, m - 1, 1)        // first day of month
      const end   = new Date(year, m, 0, 23, 59, 59) // last day of month
      filter.date = { $gte: start, $lte: end }
    }

    // MongoDB aggregation — group by type and sum amounts
    const summary = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type",          // group by "income" or "expense"
          total: { $sum: "$amount" } // sum all amounts in each group
        }
      }
    ])

    // Convert array to object for easier use
    const result = { income: 0, expense: 0 }
    summary.forEach(s => { result[s._id] = s.total })
    result.balance = result.income - result.expense
    result.savingsRate = result.income > 0
      ? Math.round((result.balance / result.income) * 100)
      : 0

    res.json(result)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
