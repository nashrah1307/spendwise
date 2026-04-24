import express from "express"
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transactionController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// All transaction routes are protected
router.use(protect) // applies protect middleware to ALL routes below

router.get("/summary", getSummary)       // GET  /api/transactions/summary
router.get("/",        getTransactions)  // GET  /api/transactions
router.post("/",       createTransaction)// POST /api/transactions
router.put("/:id",     updateTransaction)// PUT  /api/transactions/:id
router.delete("/:id",  deleteTransaction)// DELETE /api/transactions/:id

export default router
